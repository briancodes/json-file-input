import { newSpecPage } from "@stencil/core/testing";
import { BcJsonPreview } from "./bc-json-preview";

describe("bc-json-preview", () => {
    it("renders", async () => {
        const page = await newSpecPage({
            components: [BcJsonPreview],
            html: `<bc-json-preview></bc-json-preview>`,
        });
        expect(page).toBeTruthy();
    });
});
