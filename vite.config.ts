import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs/promises";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  console.log(loadEnv(mode, process.cwd()));
  const lang = process.env.VITE_LANG;
  const mainHtml = lang === "fr" ? "index_fr.html" : "index_nl.html";

  return defineConfig({
    publicDir: "public",
    server: {
      proxy: {
        "/@/backend/api": "https://association.nl.stg.amphion.be/",
      },
    },
    build: {
      rollupOptions: {
        input: {
          app: mainHtml,
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        template: mainHtml,
        inject: {
          tags: [
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "og:title",
                content: lang === "fr" ? "Soutenezvotre association" : "Steunjouwvereniging",
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "twitter:title",
                content: lang === "fr" ? "Soutenezvotre association" : "Steunjouwvereniging",
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "og:description",
                content:
                  lang === "fr"
                    ? "LA MANIÈRE LA PLUS DÉLICIEUSE DE COLLECTER DES FONDS POUR VOTRE ASSOCIATION"
                    : "DE LEKKERSTE MANIER OM MET JULLIE VERENIGING GELD IN TE ZAMELEN",
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "twitter:description",
                content:
                  lang === "fr"
                    ? "LA MANIÈRE LA PLUS DÉLICIEUSE DE COLLECTER DES FONDS POUR VOTRE ASSOCIATION"
                    : "DE LEKKERSTE MANIER OM MET JULLIE VERENIGING GELD IN TE ZAMELEN",
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "og:image",
                content: getImagePath(lang === "fr" ? "twitter_post-fr.png" : "twitter_post-nl.png"),
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "twitter:image",
                content: getImagePath(lang === "fr" ? "twitter_post-fr.png" : "twitter_post-nl.png"),
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "twitter:card",
                content: "summary_large_image",
              },
            },
            {
              injectTo: "head",
              tag: "meta",
              attrs: {
                property: "og:locale",
                content: lang === "fr" ? "fr_FR" : "nl_NL",
              },
            },
          ],
        },
      }),
      {
        name: "vite-postbuild",
        closeBundle: async () => {
          const buildDir = path.join(__dirname, "dist");
          const oldPath = path.join(buildDir, mainHtml);
          const newPath = path.join(buildDir, "index.html");

          await fs.rename(oldPath, newPath);
        },
      },
    ],
    resolve: {
      alias: {
        "@": createResolver(""),
        state: createResolver("state"),
        hooks: createResolver("hooks"),
        layout: createResolver("layout"),
        utils: createResolver("utils"),
        components: createResolver("components"),
        services: createResolver("services"),
        assets: createResolver("assets"),
        pages: createResolver("pages"),
        config: createResolver("config"),
      },
    },
  });

  function getImagePath(imageName) {
    const env: string = process.env.VITE_ENV;
    return env === "stg"
      ? `https://association.${lang}.stg.amphion.be/${imageName}`
      : lang === "nl"
        ? `https://steunjouwverening.be/${imageName}`
        : `https://soutenezvotreassociation.be/${imageName}`;
  }
};

function createResolver(dir: string) {
  return `${path.resolve(__dirname, `./src/${dir}/`)}`;
}
