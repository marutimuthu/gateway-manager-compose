import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "EdgeOps",
      logo: {
        light: "/src/assets/logo-light.png",
        dark: "/src/assets/logo-dark.png",
        replacesTitle: true,
      },
      social: {
        // github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {
          label: "Overview",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Motivation", link: "/overview/motivation/" },
          ],
        },
        {
          label: "Core concepts",
          items: [
            { label: "IoT Gateway Vs Edge Gateway", link: "/guides/iotvsedge/" },
            { label: "Edge Computing Vs Cloud Computing", link: "/guides/edge-vs-cloud/" },
            { label: "Device Management", link: "/guides/device-management/" },
            { label: "Industrial Edge", link: "/guides/edge-computing/" },
            { label: "IoT Team", link: "/guides/users/" },
            { label: "Data Pipeline", link: "/guides/datasource/" },
          ],
        },
        {
          label: "Getting Started",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Instance Setup", link: "/getting-started/setup/" },
            { label: "Add your team", link: "/getting-started/team/" },
            { label: "Onboard a device", link: "/guides-copy/example/" },
            { label: "Deploy a device", link: "/guides-copy/example/" },
            { label: "Deploy a Data source", link: "/guides-copy/example/" },
            {
              label: "Explore",
              items: [
                { label: "Device View", link: "/guides-copy/example/" },
                {
                  label: "Asset Type View",
                  link: "/guides-copy/example/",
                },
                {
                  label: "Device Type View",
                  link: "/guides-copy/example/",
                },
                {
                  label: "Data source View",
                  link: "/guides-copy/example/",
                },
              ],
            },
            // link: '/guides-copy/example/' },
            // { label: 'Create post-installation checklist', link: '/guides-copy/example/' },
            // { label: 'Deploy a device', link: '/guides-copy/example/' },
          ],
        },
		{
			label: "Repository",
			items: [
			  // Each item here is one entry in the navigation menu.
			  { label: "Document Types", link: "/guides-copy/example/" },
			  { label: "Uploading Document", link: "/guides-copy/example/" },
			  { label: "Update Whitelist", link: "/guides-copy/example/" },			  
			],
		  },
        {
          label: "Supported IoT Gateways",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "LogicIO", link: "/getting-started/setup/" },
            { label: "Teltonika", link: "/getting-started/team/" },
            { label: "ESP32", link: "/guides-copy/example/" },
            { label: "EC200U", link: "/guides-copy/example/" },
          ],
        },
        {
          label: "Supported Edge Gateways",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Raspberry Pi", link: "/guides-copy/example/" },
            { label: "Nvidia Jetson", link: "/guides-copy/example/" },
          ],
        },
        {
          label: "Supported Data Sources",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "REST APIs", link: "/data-sources/http/" },
            { label: "Modbus", link: "/data-sources/modbus/" },
            { label: "MQTT", link: "/data-sources/mqtt/" },
            { label: "OPCUA", link: "/data-sources/opcua/" },
          ],
        },
        {
          label: "Other Services",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Creating Custom Data Flows",
              link: "/guides-copy/example/",
            },
            {
              label: "Create Visualisation Dashboards",
              link: "/guides-copy/example/",
            },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
