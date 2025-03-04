/* 
    * @author: https://github.com/hinditutorpoint
    * @license: MIT
    * @version: 1.0.0
    * @description: InputChooser is a lightweight JavaScript plugin that enables a drag & drop file upload experience with a built-in file preview and delete option. No external dependencies required!
*/
class InputChooser {
    constructor(selector) {
        this.dropzones = document.querySelectorAll(selector);
        this.injectStyles();
        if (this.dropzones.length > 0) {
            this.init();
        }
    }

    injectStyles() {
        if (document.getElementById("file-uploader-styles")) return;

        const style = document.createElement("style");
        style.id = "file-uploader-styles";
        style.innerHTML = `
            .dropzone-area {
                border: 2px dashed #ccc;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                position: relative;
                width: 100%;
                max-width: 350px;
                margin: 10px auto;
                border-radius: 10px;
                transition: 0.3s;
            }
            .dropzone-area:hover {
                border-color: blue;
            }
            .dropzone-area.drag-over {
                border-color: blue;
                background-color: rgba(0, 0, 255, 0.1);
            }
            .hidden-input {
                display: none;
            }
            .preview-container {
                position: relative;
                display: inline-block;
                margin-top: 10px;
                max-width: 100%;
            }
            .preview-image {
                max-width: 100%;
                height: auto;
                display: none;
                border: 1px solid #ddd;
                padding: 5px;
                border-radius: 5px;
            }
            .error-message {
                color: red;
                margin-top: 5px;
                font-size: 14px;
            }
            .clear-button {
                display: none;
                position: absolute;
                top: -10px;
                right: -10px;
                background: red;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 14px;
                padding: 6px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                text-align: center;
                line-height: 12px;
                box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
            }
            .clear-button:hover {
                background: darkred;
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        this.dropzones.forEach(dropzone => {
            if (dropzone.innerHTML.trim() === "") {
                dropzone.innerHTML = `
                    <p>Drag & drop your file here or</p>
                    <span style="color: blue; text-decoration: underline;">click to upload</span>
                `;
            }

            const inputName = dropzone.dataset.name || "file";
            let input = dropzone.querySelector("input[type='file']");
            if (!input) {
                input = document.createElement("input");
                input.type = "file";
                input.classList.add("hidden-input");
                input.name = inputName;
                dropzone.appendChild(input);
            }

            let errorMsg = dropzone.querySelector(".error-message");
            if (!errorMsg) {
                errorMsg = document.createElement("div");
                errorMsg.classList.add("error-message");
                dropzone.appendChild(errorMsg);
            }

            let previewContainer = dropzone.querySelector(".preview-container");
            if (!previewContainer) {
                previewContainer = document.createElement("div");
                previewContainer.classList.add("preview-container");
                dropzone.appendChild(previewContainer);
            }

            let previewImage = dropzone.querySelector(".preview-image");
            if (!previewImage) {
                previewImage = document.createElement("img");
                previewImage.classList.add("preview-image");
                previewContainer.appendChild(previewImage);
            }

            let clearButton = dropzone.querySelector(".clear-button");
            if (!clearButton) {
                clearButton = document.createElement("button");
                clearButton.type = "button";
                clearButton.classList.add("clear-button");
                clearButton.innerHTML = "×";
                previewContainer.appendChild(clearButton);
                
                // Prevent clicking the dropzone when clicking the delete button
                clearButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    previewImage.style.display = "none";
                    input.value = "";
                    clearButton.style.display = "none";
                });
            }

            const allowedTypes = (dropzone.dataset.type || "png,jpeg").split(",").map(type => `image/${type}`);
            const maxSize = (dropzone.dataset.size || 2000) * 1024;
            const maxWidth = dropzone.dataset.width || 500;
            const maxHeight = dropzone.dataset.height || 500;

            dropzone.addEventListener("click", (e) => {
                if (!e.target.classList.contains("clear-button")) {
                    input.click();
                }
            });

            input.addEventListener("change", function () {
                if (this.files.length > 0) {
                    InputChooser.handleFile(this.files[0], previewImage, errorMsg, clearButton, { allowedTypes, maxSize, maxWidth, maxHeight });
                }
            });

            dropzone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropzone.classList.add("drag-over");
            });

            dropzone.addEventListener("dragleave", () => {
                dropzone.classList.remove("drag-over");
            });

            dropzone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropzone.classList.remove("drag-over");

                if (e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    input.files = e.dataTransfer.files;
                    InputChooser.handleFile(file, previewImage, errorMsg, clearButton, { allowedTypes, maxSize, maxWidth, maxHeight });
                }
            });
        });
    }

    static handleFile(file, previewImage, errorMsg, clearButton, options) {
        InputChooser.validateFile(file, options)
            .then(() => {
                errorMsg.textContent = "";
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = "block";
                    clearButton.style.display = "block";
                };
                reader.readAsDataURL(file);
            })
            .catch(error => {
                errorMsg.textContent = error;
                previewImage.style.display = "none";
                clearButton.style.display = "none";
            });
    }

    static validateFile(file, { allowedTypes, maxSize, maxWidth, maxHeight }) {
        return new Promise((resolve, reject) => {
            if (!allowedTypes.includes(file.type)) {
                return reject(`Invalid file type. Allowed: ${allowedTypes.join(", ").replace(/image\//g, "")}`);
            }
            if (file.size > maxSize) {
                return reject(`File size exceeds ${maxSize / 1024}KB.`);
            }

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function () {
                if (img.width > maxWidth || img.height > maxHeight) {
                    return reject(`Image dimensions should be ${maxWidth}x${maxHeight} or smaller.`);
                }
                resolve();
            };
        });
    }
}

/* // Initialize on document ready
document.addEventListener("DOMContentLoaded", function() {
    new InputChooser(".dropzone-area");
});
 */