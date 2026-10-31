import {
	checkSchematicPlacement,
	runAllSchematicChecks,
} from "@tscircuit/checks";
import type { AnyCircuitElement } from "circuit-json";
import { dirname, join } from "node:path";

export async function validateSchematic(
	circuit: AnyCircuitElement[],
	circuitPath: string,
) {
	const sheets = circuit.filter(
		(element) => element.type === "schematic_sheet",
	);
	const components = circuit.filter(
		(element) => element.type === "source_component" && !["subassembly", "printedpart"].includes(element.ftype),
	);
	const schematicComponents = circuit.filter(
		(element) => element.type === "schematic_component",
	);
	const texts = circuit.filter((element) => element.type === "schematic_text");
	const missingNotes = components
		.filter(
			(component) =>
				!texts.some((text) => text.text.startsWith(`${component.name}: `)),
		)
		.map((component) => component.name);
	const detachedNotes = components.flatMap((component) => {
		const symbol = schematicComponents.find((e) => e.source_component_id === component.source_component_id);
		const note = texts.find((e) => e.text.startsWith(`${component.name}: `));
		if (!symbol || !note) return [];
		const lines = note.text.split("\n");
		const width = Math.max(...lines.map((line) => line.length)) * note.font_size * 0.62;
		const height = lines.length * note.font_size * 1.3;
		const dx = Math.max(0, note.position.x - (symbol.center.x + symbol.size.width / 2), symbol.center.x - symbol.size.width / 2 - (note.position.x + width));
		const dy = Math.max(0, note.position.y - height - (symbol.center.y + symbol.size.height / 2), symbol.center.y - symbol.size.height / 2 - note.position.y);
		return note.schematic_sheet_id !== symbol.schematic_sheet_id || Math.hypot(dx, dy) > 3.5 ? [component.name] : [];
	});
	const sheetIds = new Set(sheets.map((sheet) => sheet.schematic_sheet_id));
	const unassigned = schematicComponents.filter(
		(component) =>
			!component.schematic_sheet_id ||
			!sheetIds.has(component.schematic_sheet_id),
	);
	const sourceErrors = circuit.filter(
		(element) =>
			element.type.endsWith("_error") && !element.type.startsWith("pcb_"),
	);
	const placement = checkSchematicPlacement(circuit);
	const styling = await runAllSchematicChecks(circuit);
	const report = {
		sheets: sheets.length,
		sourceComponents: components.length,
		schematicComponents: schematicComponents.length,
		annotatedComponents: components.length - missingNotes.length,
		missingNotes,
		detachedNotes,
		unassignedComponents: unassigned.length,
		sourceErrors,
		placementFindings: placement,
		schematicStyleFindings: styling,
	};
	await Bun.write(
		join(dirname(circuitPath), "schematic-validation.json"),
		JSON.stringify(report, null, 2),
	);
	if (
		components.length !== 123 ||
		schematicComponents.length !== 123 ||
		missingNotes.length ||
		detachedNotes.length ||
		unassigned.length ||
		sourceErrors.length ||
		placement.length ||
		styling.length
	) {
		throw Error("Schematic validation failed; see schematic-validation.json");
	}
	console.log(
		`Schematic checks passed: ${sheets.length} sheets; all ${components.length} components annotated.`,
	);
	return report;
}

if (import.meta.main) {
	const circuitPath =
		process.argv[2] ??
		(process.env.GBA_AA_CELLS === "3"
			? "dist/index-3aa/circuit.json"
			: "dist/index/circuit.json");
	await validateSchematic(await Bun.file(circuitPath).json(), circuitPath);
}
