/* 
    * @author: https://github.com/hinditutorpoint
    * @enhanced-by: [Rajesh Kumar Dhuriya]
    * @license: MIT
    * @version: v1.0.1
    * @description: InputChooser is a lightweight JavaScript plugin that enables a drag & drop file upload experience with preview support for multiple file types (images, audio, video, documents, archives).
*/
class InputChooser {
    constructor(selector, options = {}) {
        this.dropzones = document.querySelectorAll(selector);
        this.options = {
            maxFiles: options.maxFiles || 1,
            multiSelect: options.multiSelect || false,
            customExtensions: options.customExtensions || [],
            ...options
        };
        this.injectStyles();
        if (this.dropzones.length > 0) {
            this.init();
        }
    }

    injectStyles() {
        if (document.getElementById("input-chooser-styles")) return;

        const style = document.createElement("style");
        style.id = "input-chooser-styles";
        style.innerHTML = `
            .dropzone-area {
                border: 2px dashed #d1d5db;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                position: relative;
                width: 100%;
                max-width: 600px;
                margin: 1rem auto;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
                background-color: #f9fafb;
            }
            .dropzone-area:hover {
                border-color: #3b82f6;
                background-color: #f0f7ff;
            }
            .dropzone-area.drag-over {
                border-color: #3b82f6;
                background-color: #ebf5ff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
            }
            .dropzone-area .dropzone-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            .dropzone-area .dropzone-icon {
                font-size: 2.5rem;
                color: #3b82f6;
                margin-bottom: 0.5rem;
            }
            .dropzone-area .dropzone-text {
                color: #4b5563;
                font-size: 1rem;
                margin: 0;
            }
            .dropzone-area .dropzone-hint {
                color: #6b7280;
                font-size: 0.875rem;
                margin: 0;
            }
            .dropzone-area .dropzone-button {
                color: #3b82f6;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 0.875rem;
                text-decoration: underline;
                margin-top: 0.5rem;
            }
            .hidden-input {
                display: none;
            }
            .preview-container {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 1.5rem;
                width: 100%;
            }
            .preview-item {
                position: relative;
                border: 1px solid #e5e7eb;
                border-radius: 0.375rem;
                padding: 0.75rem;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
                flex: 1 1 calc(33.333% - 1rem);
                min-width: 120px;
                max-width: 100%;
                box-sizing: border-box;
            }
            .preview-container.single-item .preview-item,
            .preview-container:has(.preview-item:only-child) .preview-item {
                flex: 1 1 100%;
            }
            .preview-thumbnail {
                width: 100%;
                height: 100px;
                object-fit: contain;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 0.5rem;
                overflow: hidden;
            }
            .preview-thumbnail img {
                max-width: 100%;
                max-height: 100%;
            }
            .preview-thumbnail .file-icon {
                font-size: 2.5rem;
                color: #6b7280;
            }
            .preview-info {
                text-align: center;
                font-size: 0.75rem;
                color: #4b5563;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .preview-info .file-name {
                font-weight: 500;
                margin-bottom: 0.25rem;
            }
            .preview-info .file-size {
                color: #6b7280;
            }
            .clear-button {
                position: absolute;
                top: -0.5rem;
                right: -0.5rem;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 1.5rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 0.875rem;
                line-height: 1;
                padding: 0;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
            }
            .clear-button:hover {
                background: #dc2626;
                transform: scale(1.1);
            }
            .error-message {
                color: #ef4444;
                margin-top: 0.5rem;
                font-size: 0.875rem;
                text-align: center;
            }
            .progress-container {
                width: 100%;
                background-color: #e5e7eb;
                border-radius: 0.25rem;
                margin-top: 0.5rem;
                overflow: hidden;
                display: none;
            }
            .progress-bar {
                height: 0.5rem;
                background-color: #3b82f6;
                width: 0%;
                transition: width 0.3s ease;
            }
            @media (max-width: 640px) {
                .preview-item {
                    flex: 1 1 calc(50% - 1rem);
                }
                .preview-container.single-item .preview-item,
                .preview-container:has(.preview-item:only-child) .preview-item {
                    flex: 1 1 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    getFileIcon(type) {
        const icons = {
            // Images
            'image/': '🖼️',
            // Documents
            'application/pdf': '📄',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'application/vnd.ms-powerpoint': '📑',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📑',
            'text/plain': '📄',
            'text/csv': '📊',
            // Archives
            'application/zip': '🗄️',
            'application/x-rar-compressed': '🗄️',
            'application/x-7z-compressed': '🗄️',
            'application/x-tar': '🗄️',
            'application/x-gzip': '🗄️',
            // Audio
            'audio/': '🎵',
            // Video
            'video/': '🎬',
            // Default
            'default': '📁'
        };

        for (const [key, value] of Object.entries(icons)) {
            if (type.startsWith(key)) {
                return value;
            }
        }

        return icons.default;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    init() {
        this.dropzones.forEach(dropzone => {
            // Initialize dropzone content
            if (dropzone.innerHTML.trim() === "") {
                dropzone.innerHTML = `
                    <div class="dropzone-content">
                        <div class="dropzone-icon">📁</div>
                        <p class="dropzone-text">Drag & drop files here</p>
                        <p class="dropzone-hint">or</p>
                        <button type="button" class="dropzone-button">Browse files</button>
                    </div>
                    <div class="preview-container"></div>
                    <div class="error-message"></div>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                `;
            }

            const inputName = dropzone.dataset.name || "file";
            let input = dropzone.querySelector("input[type='file']");
            if (!input) {
                input = document.createElement("input");
                input.type = "file";
                input.classList.add("hidden-input");
                input.name = inputName;
                if (this.options.multiSelect) {
                    input.multiple = true;
                }
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

            let progressContainer = dropzone.querySelector(".progress-container");
            if (!progressContainer) {
                progressContainer = document.createElement("div");
                progressContainer.classList.add("progress-container");
                const progressBar = document.createElement("div");
                progressBar.classList.add("progress-bar");
                progressContainer.appendChild(progressBar);
                dropzone.appendChild(progressContainer);
            }

            const allowedTypes = dropzone.dataset.type ? 
                dropzone.dataset.type.split(",").map(t => t.trim()) : 
                ['image/*', 'audio/*', 'video/*', 'application/pdf', 
                 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                 'application/zip', 'application/x-rar-compressed'];
            
            const maxSize = dropzone.dataset.size ? parseInt(dropzone.dataset.size) * 1024 : 10 * 1024 * 1024; // 10MB default

            // Click handler
            dropzone.addEventListener("click", (e) => {
                if (!e.target.classList.contains("clear-button") && 
                    !e.target.classList.contains("preview-item") &&
                    !e.target.closest(".preview-item")) {
                    input.click();
                }
            });

            // Input change handler
            input.addEventListener("change", () => {
                if (input.files.length > 0) {
                    this.handleFiles(input.files, dropzone, previewContainer, errorMsg, { allowedTypes, maxSize });
                }
            });

            // Drag and drop handlers
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
                    input.files = e.dataTransfer.files;
                    this.handleFiles(e.dataTransfer.files, dropzone, previewContainer, errorMsg, { allowedTypes, maxSize });
                }
            });
        });
    }

    handleFiles(files, dropzone, previewContainer, errorMsg, options) {
        errorMsg.textContent = "";
        
        if (this.options.maxFiles > 0 && files.length > this.options.maxFiles) {
            errorMsg.textContent = `Maximum ${this.options.maxFiles} file(s) allowed.`;
            return;
        }

        if (!this.options.multiSelect) {
            previewContainer.innerHTML = '';
        }

        Array.from(files).forEach(file => {
            this.validateFile(file, options)
                .then(() => {
                    this.createPreview(file, previewContainer);
                    this.updatePreviewLayout(previewContainer);
                })
                .catch(error => {
                    errorMsg.textContent = error;
                });
        });
    }

    createPreview(file, previewContainer) {
        const previewItem = document.createElement("div");
        previewItem.classList.add("preview-item");
        
        const previewThumbnail = document.createElement("div");
        previewThumbnail.classList.add("preview-thumbnail");
        
        const previewInfo = document.createElement("div");
        previewInfo.classList.add("preview-info");
        
        const fileName = document.createElement("div");
        fileName.classList.add("file-name");
        fileName.textContent = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
        
        const fileSize = document.createElement("div");
        fileSize.classList.add("file-size");
        fileSize.textContent = this.formatFileSize(file.size);
        
        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.classList.add("clear-button");
        clearButton.innerHTML = "×";
        clearButton.addEventListener("click", (e) => {
            e.stopPropagation();
            previewItem.remove();
            this.updatePreviewLayout(previewContainer);
        });
        
        previewInfo.appendChild(fileName);
        previewInfo.appendChild(fileSize);
        previewItem.appendChild(previewThumbnail);
        previewItem.appendChild(previewInfo);
        previewItem.appendChild(clearButton);
        
        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                previewThumbnail.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.controls = true;
            video.muted = true;
            video.src = URL.createObjectURL(file);
            video.style.maxHeight = "100%";
            video.style.maxWidth = "100%";
            previewThumbnail.appendChild(video);
        } else if (file.type.startsWith("audio/")) {
            const audio = document.createElement("audio");
            audio.controls = true;
            audio.src = URL.createObjectURL(file);
            previewThumbnail.appendChild(audio);
        } else {
            const icon = document.createElement("div");
            icon.classList.add("file-icon");
            icon.textContent = this.getFileIcon(file.type);
            previewThumbnail.appendChild(icon);
        }
        
        previewContainer.appendChild(previewItem);
    }

    updatePreviewLayout(previewContainer) {
        const previewItems = previewContainer.querySelectorAll('.preview-item');
        previewContainer.classList.toggle('single-item', previewItems.length === 1);
    }

    validateFile(file, { allowedTypes, maxSize }) {
        return new Promise((resolve, reject) => {
            // Check file size first (quick check)
            if (file.size > maxSize) {
                return reject(`File size exceeds ${this.formatFileSize(maxSize)}`);
            }

            // Get file extension
            const fileExt = file.name.split('.').pop().toLowerCase();
            
            // Check against custom extensions if provided
            if (this.options.customExtensions.length > 0) {
                const isCustomAllowed = this.options.customExtensions.some(ext => {
                    // Support both ".ext" and "ext" format
                    const cleanExt = ext.startsWith('.') ? ext.substring(1) : ext;
                    return fileExt === cleanExt.toLowerCase();
                });

                if (isCustomAllowed) {
                    return resolve(); // Bypass MIME type check for custom extensions
                }
            }

            // Check MIME type against allowed types
            let typeMatch = false;
            for (const type of allowedTypes) {
                if (type.endsWith('/*')) {
                    // Wildcard matching (e.g., image/*)
                    if (file.type.startsWith(type.replace('/*', '/'))) {
                        typeMatch = true;
                        break;
                    }
                } else if (file.type === type) {
                    typeMatch = true;
                    break;
                } else if (type.startsWith('.')) {
                    // Extension-based matching (e.g., .psd)
                    const ext = type.substring(1);
                    if (fileExt === ext.toLowerCase()) {
                        typeMatch = true;
                        break;
                    }
                }
            }
            
            if (!typeMatch) {
                return reject(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}${this.options.customExtensions.length > 0 ? ' or extensions: ' + this.options.customExtensions.join(', ') : ''}`);
            }
            
            resolve();
        });
    }

    uploadFiles(url, options = {}) {
        return new Promise((resolve, reject) => {
            // This would be implemented based on your backend requirements
            // You would typically use XMLHttpRequest or fetch API here
            console.log("Upload functionality would be implemented here");
            resolve();
        });
    }
}