import { newSpecPage } from "@stencil/core/testing";
import { createMockFileReader, generateFiles } from "../../utils/utils.spec";
import { BcJsonPreview } from "../bc-json-preview/bc-json-preview";
import { BcJsonFileInput, IFileData } from "./bc-json-file-input";

const HTML_DEFAULT_SLOT = `
    <bc-json-file-input multiple preview-json>                    
    </bc-json-file-input>
`;
const HTML_CUSTOM_SLOT = `
    <bc-json-file-input multiple preview-json> 
        <button id="custom-button">Custom Button</button>                   
    </bc-json-file-input>
`;

// Run a single Test (or filtered) with path match
// npm run test:unit -- src/components/bc

// newSpecPage properties and methods
// @see https://stenciljs.com/docs/unit-testing#spec-page-results

describe("bc-json-file-input", () => {
    it("renders default button slot", async () => {
        const page = await newSpecPage({
            components: [BcJsonFileInput],
            html: HTML_DEFAULT_SLOT,
        });

        const { root } = page;
        const { shadowRoot } = root;

        const button = shadowRoot.querySelector("button");
        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toEqual("Upload Files");

        const input = shadowRoot.querySelector("input");
        const inputClickSpy = jest.spyOn(input, "click");

        button.click();

        expect(inputClickSpy).toHaveBeenCalledTimes(1);
    });

    it("renders custom button element as a slot", async () => {
        const page = await newSpecPage({
            components: [BcJsonFileInput],
            html: HTML_CUSTOM_SLOT,
        });

        const { root } = page;

        // Note: event delegation on the slot element parent doesn't seem
        // to work in unti tests (might have to use e2e)
        const button = root.querySelector(
            "#custom-button"
        ) as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toEqual("Custom Button");
    });

    it("emits events when files processed", async (done) => {
        expect.assertions(2);

        const page = await newSpecPage({
            components: [BcJsonFileInput],
            html: HTML_DEFAULT_SLOT,
        });

        const { root } = page;
        const { shadowRoot } = root;

        const input = shadowRoot.querySelector("input");
        const files = generateFiles(2);
        (global as any).FileReader = createMockFileReader(files) as any;
        input.files = files as any;

        // This test will be synchronous
        root.addEventListener("filesLoaded", (ev: CustomEvent<File[]>) => {
            expect(ev.detail.length).toEqual(2);
        });

        // Mocked reader is async, hence using done()
        root.addEventListener("filesRead", (ev: CustomEvent<IFileData[]>) => {
            expect(ev.detail.length).toEqual(2);
            done();
        });

        input.dispatchEvent(new Event("change"));
    });

    it("renders preview panels", async () => {
        expect.assertions(3);

        // Import BcJsonPreview also
        const page = await newSpecPage({
            components: [BcJsonFileInput, BcJsonPreview],
            html: HTML_DEFAULT_SLOT,
        });

        const { root } = page;
        const { shadowRoot } = root;

        const input = shadowRoot.querySelector("input");
        const files = generateFiles(2);

        // synchronous mock with createMockFileReader(file, false)
        (global as any).FileReader = createMockFileReader(files, false) as any;
        input.files = files as any;

        root.addEventListener("filesLoaded", (ev: CustomEvent<File[]>) => {
            expect(ev.detail.length).toEqual(2);
        });

        root.addEventListener("filesRead", (ev: CustomEvent<IFileData[]>) => {
            expect(ev.detail.length).toEqual(2);
            console.log("files read");
        });

        input.dispatchEvent(new Event("change"));

        // wait for preview panel update and root listeners to be handled
        await page.waitForChanges();

        const previewElement = shadowRoot.querySelector("bc-json-preview");
        const previewShadow = previewElement.shadowRoot;

        const detailsElements = previewShadow.querySelectorAll("details");
        expect(detailsElements.length).toEqual(2);

        console.log("fin");
    });
});
