
class FrameworkHandler {
	constructor() {
		this.frameworkEnabled = GetConvarInt("radio_frameworkEnabled", 0);
		this.frameworkName = GetConvar("radio_frameworkName", "pma-framework");
		this.frameworkExportLoadName = GetConvar("radio_loadExportName", "getData");
		this.framework = this.frameworkEnabled ? globalThis.exports[this.frameworkName][this.frameworkExportLoadName]() : null;
		this.frameworkFunction = null;
		if (this.frameworkEnabled) {
			this.frameworkFunction = async (resource) => {
				if (resource !== this.frameworkName) return;
				await Delay(250);
				this.framework = globalThis.exports[this.frameworkName][this.frameworkExportLoadName]()
			}
			on("onClientResourceStart", this.frameworkFunction)
		}
	}
}

// globalThis.frameworkHandler =
