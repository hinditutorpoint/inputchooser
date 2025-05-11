# InputChooser - Drag & Drop File Upload Plugin

## 📌 Overview
**InputChooser** is a lightweight JavaScript plugin that enables a **drag & drop file upload** experience with a built-in **file preview and delete option**. No external dependencies required!

## 🎯 Features
- 📂 **Drag & Drop File Upload**
- 📸 **Image Preview Before Upload**
- ❌ **Clear/Delete Uploaded File**
- 🎨 **Auto-injected Styles** (No separate CSS needed)
- 📱 **Fully Responsive & Mobile Friendly**
- 🛠 **Customizable File Type, Size, and Dimensions**

## 📥 Installation
Just include the **InputChooser.js** file in your project.

### Using File:
```html
<script src="path/to/InputChooser.js"></script>
```
### Using CDN
```html
<script src="https://cdn.jsdelivr.net/gh/hinditutorpoint/inputchooser@latest/InputChooser.min.js"></script>
```

### 🚀 Usage
Simply add a `.dropzone-area` div in your HTML:
```html
<div class="dropzone-area" 
    data-name="cashier" 
    data-size="100" 
    data-type="png,jpeg,gif" 
    data-width="500" 
    data-height="500">
</div>
```

### 📌 Attributes:
- `data-name` → Input name attribute
- `data-size` → Maximum file size (in KB)
- `data-type` → Allowed file types (comma-separated: png,jpeg,gif)
- `data-width` → Maximum image width
- `data-height` → Maximum image height

### Initialize the Plugin
```js
document.addEventListener("DOMContentLoaded", function() {
    new InputChooser(".dropzone-area");
});

// Example initialization with options
document.addEventListener("DOMContentLoaded", function() {
    new InputChooser(".dropzone-area", {
        maxFiles: 5,
        multiSelect: true
    });
});

// Initialize with custom extensions via JavaScript
new InputChooser(".dropzone-area", {
    maxFiles: 5,
    multiSelect: true,
    customExtensions: ['.psd', '.ai', 'eps'] // Both formats supported
});
```
## ⚙️ Features in Detail
### ✅ Auto-injected Styles
You don’t need to include extra CSS. The plugin automatically applies a clean, modern design.

### 📸 Image Preview & ❌ Delete Option
- When a file is uploaded, it shows a preview.
- A round delete button (❌) allows users to remove the selected file without opening the file chooser.

### 🔄 Drag & Drop or Click-to-Upload
Users can simply drag & drop files or click the area to open the file chooser.

### 🛠 Customization
You can modify the styles in `injectStyles()` inside `InputChooser.js` to match your UI theme.

### 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### ❤️ Contributions
Feel free to contribute! Open a pull request or an issue if you have improvements or bug fixes.
#### Features need to contribute
- Detection image is avatar or not if `data-is-avatar="true"`
- Detection image is signature or not if `data-is-sign="true"`

### 📧 Contact
For questions or suggestions, reach out to me via GitHub Issues. 😊<br/>
Rajesh Kumar Dhuriya
Email: hinditutorpoint@gmail.com
