if (document.getElementById("preview")) {
  const imageInput = document.querySelector(".file-input");
  imageInput.addEventListener("change", previewImage);
  function previewImage(e) {
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(e.target.files[0]);
    preview.addEventListener("load", () => URL.revokeObjectURL(preview.src));
  }
}
