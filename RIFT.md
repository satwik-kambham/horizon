# Horizon

This a cross platform desktop and mobile application built with Vite and Tauri.

1. **Fontend**: This is a Vue 3 application using Composition API (using `<script setup>` with TypeScript support, using Vite as the build tool. Pinia is used for state management. Tailwind CSS is used for styling.

2. **Desktop & Mobile Integration**: The project uses Tauri for building cross-platform desktop and mobile applications.

3. **Project Structure**:
   - `src/`: Contains the main Vue application code
   - `src-tauri/`: Contains the Tauri configuration and Rust code
   - `public/`: Contains static assets

4. **Key Files**:
   - `package.json`: Contains scripts for development, building, and Tauri commands
   - `vite.config.ts`: Vite configuration
   - `tsconfig.json`: TypeScript configuration
   - `tauri.conf.json`: Tauri configuration

- All styling should be done only using tailwind.
- The project can be run using the command `npm run tauri dev`
- The user will provide error info if any. Do not try to read from the devtools.
