<template>
  <h3>{{ msg }}</h3>
  <main>
    <input type="file" id="up" />
    <button @click="handleUpload">上传</button>
  </main>
</template>

<script setup>
import { ElMessage } from "element-plus";

// import { ref } from "vue";

defineProps({
  msg: String,
});

const handleUpload = () => {
  const file = document.getElementById("up").files[0];
  const formData = new FormData();
  formData.append("file", file);
  console.log(file);
  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      ElMessage.success("上传成功");
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
</script>
<style scoped></style>
