import {
  Component,
  ComponentInterface,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from "@stencil/core";

const FILE_TYPE = "application/json";

@Component({
  tag: "bc-json-file-input",
  styleUrl: "bc-json-file-input.css",
  shadow: true,
})
export class BcJsonFileInput implements ComponentInterface {
  /**
   * Emits the parsed contents of the JSON file
   *
   * @type {EventEmitter<any>}
   * @memberof BcJsonFileInput
   * @see https://stenciljs.com/docs/events#event-decorator
   */
  @Event() jsonParsed: EventEmitter<any>;

  /**
   * Render the parsed JSON in a `div` below the button
   *
   * @type {boolean}
   * @memberof BcJsonFileInput
   */
  @Prop() previewJson: boolean = true;

  private inputElement: HTMLInputElement;

  // @see https://reactjs.org/docs/handling-events.html#passing-arguments-to-event-handlers
  handleButtonClick = () => {
    this.inputElement.click();
  };

  handleInputChange = () => {
    const file = this.inputElement.files[0] as File;
    if (!file || file.type !== FILE_TYPE) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      const json = ev.target.result as string;
      const parsed = JSON.parse(json);
      this.jsonParsed.emit(parsed);
    });
    reader.readAsText(file);
  };

  render() {
    return (
      <Host>
        <button class="upload-button" onClick={this.handleButtonClick}>
          <slot>
            <span>Upload File</span>
          </slot>
        </button>
        <input
          class="file-input"
          type="file"
          accept=".json"
          ref={(el) => {
            this.inputElement = el;
          }}
          onChange={this.handleInputChange}
        />
      </Host>
    );
  }
}
