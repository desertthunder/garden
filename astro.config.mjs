// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
    integrations: [
        starlight({
            title: "My Docs",
            social: {
                github: "https://github.com/withastro/starlight",
            },
            sidebar: [
                {
                    label: "Getting Started",
                    items: [
                        { label: "Welcome", slug: "" },
                        { label: "Books", slug: "books" },
                    ],
                },
                {
                    label: "Writing",
                    collapsed: true,
                    autogenerate: { directory: "writing" },
                },
                {
                    label: "Philosophy",
                    collapsed: true,
                    autogenerate: { directory: "philosophy" },
                },
                {
                    label: "Psychology",
                    collapsed: true,
                    autogenerate: { directory: "psychology" },
                },
                {
                    label: "Sociology",
                    collapsed: true,
                    autogenerate: { directory: "sociology" },
                },
                {
                    label: "Engineering",
                    collapsed: true,
                    items: [
                        { slug: "engineering" },
                        {
                            label: "Architecture",
                            collapsed: true,
                            autogenerate: {
                                directory: "engineering/architecture",
                            },
                        },
                        {
                            label: "Databases",
                            collapsed: true,
                            autogenerate: {
                                directory: "engineering/databases",
                            },
                        },
                        {
                            label: "General",
                            collapsed: true,
                            autogenerate: {
                                directory: "engineering/general",
                            },
                        },
                        {
                            label: "Web",
                            collapsed: true,
                            autogenerate: {
                                directory: "engineering/web",
                            },
                        },
                    ],
                },
                {
                    label: "Programming",
                    collapsed: true,
                    items: [
                        { slug: "programming" },
                        {
                            label: "Design",
                            collapsed: true,
                            autogenerate: { directory: "programming/design" },
                        },
                        {
                            label: "Data Structures",
                            collapsed: true,
                            autogenerate: {
                                directory: "programming/data_structures",
                            },
                        },
                        {
                            label: "Algorithms",
                            collapsed: true,
                            autogenerate: {
                                directory: "programming/algorithms",
                            },
                        },
                        {
                            label: "Functional Programming",
                            collapsed: true,
                            autogenerate: {
                                directory: "programming/functional_programming",
                            },
                        },
                        {
                            label: "Golang",
                            collapsed: true,
                            autogenerate: { directory: "programming/golang" },
                        },
                        {
                            label: "Python",
                            collapsed: true,
                            autogenerate: { directory: "programming/python" },
                        },
                        {
                            label: "Rust",
                            collapsed: true,
                            autogenerate: { directory: "programming/rust" },
                        },
                    ],
                },
            ],
        }),
    ],
});
