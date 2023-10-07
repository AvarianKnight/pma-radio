import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';
import fetch from "node-fetch";

const projectRootDir = path.resolve(__dirname);

let lastRebuild = 0;

function onRebuild() {
	// Wait before each rebuild incase we're using a local version of a library
	// so we dont spam 100000 rebuilds in a second
	if (Date.now() - lastRebuild > 300) {
		lastRebuild = Date.now();
		try {
			fetch(`http://127.0.0.1:4689/rr?resource=pma-radio-v2`, {
				method: 'GET',
			});
		} catch (e) {
			console.error(`Failed to restart pma-radio`)
		}
	}
}



// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte({
		onwarn(warning, handler) {
			if (!warning.code.startsWith("a11y-"))
				handler(warning)
		},
	}),
	{
		name: "restart ui",
		closeBundle: () => {
			onRebuild();
		}
	},
	],
	resolve: {
		alias: [
			{ find: "$lib", replacement: path.resolve(projectRootDir, 'src/lib') },
			{ find: "$components", replacement: path.resolve(projectRootDir, 'src/components') },
			{ find: "$utils", replacement: path.resolve(projectRootDir, 'src/utils') },
		]
	},
	assetsInclude: ["./src/lib/assets/**/*.ogg"],
	build: {
		outDir: 'build',
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		},
		sourcemap: "inline",
	},
	base: './',
})
