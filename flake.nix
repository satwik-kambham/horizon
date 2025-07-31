{
  description = "Tauri Devshell";
  
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";    
    rust-overlay.url = "github:oxalica/rust-overlay";
  };
  
  outputs = { self, nixpkgs, rust-overlay }:
    let
      system = "x86_64-linux";
      overlays = [ (import rust-overlay) ];
      pkgs = import nixpkgs {
        inherit system overlays;
        config = {
          android_sdk.accept_license = true;
          allowUnfree = true;
        };
      };

      androidEnv = pkgs.callPackage "${nixpkgs}/pkgs/development/mobile/androidenv" {
        inherit pkgs;
        licenseAccepted = true;
      };
      androidPkgs = androidEnv.composeAndroidPackages {
        platformVersions = [ "34" "36" ];
        buildToolsVersions = [ "35.0.0" ];
        includeEmulator = false;
        includeSystemImages = false;
        includeNDK = "if-supported";
        useGoogleAPIs = true;
        extraLicenses = [
          "android-googletv-license"
          "android-sdk-arm-dbt-license"
          "android-sdk-preview-license"
          "android-sdk-license"
          "google-gdk-license"
          "intel-android-extra-license"
          "intel-android-sysimage-license"
          "mips-android-sysimage-license"
        ];
      };
    in
    {
      devShell.${system} = pkgs.mkShell rec {
        packages = with pkgs; [
          (rust-bin.stable.latest.default.override {
            targets = [
              "aarch64-linux-android"
              "armv7-linux-androideabi"
              "i686-linux-android"
              "x86_64-linux-android"
            ];
          })
          rust-analyzer
          nodejs
          vscode-langservers-extracted
          typescript-language-server
          vue-language-server

          # Android deps
          androidPkgs.androidsdk
          androidPkgs.platform-tools
          jdk17

          # Linux desktop deps
          pkg-config
          gobject-introspection
          at-spi2-atk
          atkmm
          cairo
          gdk-pixbuf
          glib
          gtk3
          harfbuzz
          librsvg
          libsoup_3
          pango
          webkitgtk_4_1
          openssl
        ];

        JAVA_HOME = pkgs.jdk17.home;
        ANDROID_SDK_ROOT = "${androidPkgs.androidsdk}/libexec/android-sdk";
        ANDROID_NDK_ROOT = "${ANDROID_SDK_ROOT}/ndk-bundle";
        ANDROID_HOME = "${androidPkgs.androidsdk}/libexec/android-sdk";
        NDK_HOME = "${ANDROID_SDK_ROOT}/ndk-bundle";
      };
    };
}
