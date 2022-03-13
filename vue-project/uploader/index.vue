<template>
  <h3>{{ msg }}</h3>
  <main>
    <input type="file" id="up" />
    <button @click="handleUpload">上传</button>
  </main>
</template>

<script setup>
import { ElMessage } from "element-plus";

import { ref, computed } from "vue";

const chunkSize = 1024 * 200;

const index = ref(0);

const start = computed(() => {
  return chunkSize * index.value;
});
defineProps({
  msg: String,
});

const handleUpload = () => {
  const file = document.getElementById("up").files[0];

  if (!file) return;

  let startByte = start.value;

  console.log("startByte:", startByte);

  if (startByte > file.size) {
    ElMessage.success("上传完成");
    index.value = 0;
    return;
  }

  const formData = new FormData();
  const chunkedFile = getChunkedFile(file, startByte);
  formData.append("file", chunkedFile);

  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then(() => {
      // ElMessage.info(`上传成功: ${blobName}`);
      index.value++;
      setTimeout(handleUpload, 500);
      // handleUpload();
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};

const getChunkedFile = (file, startByte) => {
  const [fileName, fileType] = file.name.split(".");
  const blob = file.slice(startByte, startByte + chunkSize);
  const blobName = `${fileName}_${index.value}.${fileType}`;
  const blobFile = new File([blob], blobName);
  console.log("上传中...", blobName);
  return blobFile;
};
</script>
<style scoped></style>
