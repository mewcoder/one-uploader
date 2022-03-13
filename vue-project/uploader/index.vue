<template>
  <h3>{{ msg }}</h3>
  <main>
    <div>
      <input type="file" id="up" />
      <button class="el-button" @click="handleUpload">上传</button>
      <button class="el-button" @click="handleAbort">取消</button>
    </div>
    <div style="margin-top: 30px">
      <span>分块单位：{{ chunkSize / 1024 }}KB；</span>
      <span>文件大小：{{ Math.round(fileSize / 1024) }}KB；</span>
      <span>分块总数：{{ chunkCount }}；</span>
      <span>当前上传分块：{{ index }}</span>
    </div>
    <el-progress
      style="width: 60%; margin: auto; margin-top: 20px"
      :text-inside="true"
      :stroke-width="20"
      :percentage="process"
    />
  </main>
</template>

<script setup>
import { ElMessage, ElProgress } from "element-plus";
import { ref, computed } from "vue";
import axios from "axios";

defineProps({
  msg: String,
});

const chunkSize = 1024 * 200; // 分块大小

const index = ref(0); // 当前分块id

const chunkCount = ref(0); // 分块总数

const fileSize = ref(0);

const start = computed(() => {
  return chunkSize * index.value; // 当前分块开始位置 byte
});

const process = ref(0); // 当前进度

const handleUpload = () => {
  const file = document.getElementById("up").files[0];

  if (!file) {
    ElMessage.warning("请选择文件");
    return;
  }
  fileSize.value = file.size;
  chunkCount.value = Math.ceil(file.size / chunkSize);
  let startByte = start.value;
  console.log("startByte:", startByte);

  if (index.value + 1 > chunkCount.value) {
    ElMessage.success("上传完成");
    console.log("上传完成");
    index.value = 0;
    chunkCount.value = 0;
    fileSize.value = 0;
    document.getElementById("up").value = "";
    return;
  }

  const formData = new FormData();
  const chunkedFile = getChunkedFile(file, startByte);
  formData.append("file", chunkedFile);

  axios
    .post("/api/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        process.value = Math.round(
          (((loaded / total) * (index.value + 1)) / chunkCount.value) * 100
        );
      },
    })
    .then(() => {
      // ElMessage.info(`上传成功: ${blobName}`);
      index.value++;
      setTimeout(handleUpload);
      // handleUpload();
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};

// 获取文件分块
const getChunkedFile = (file, startByte) => {
  const [fileName, fileType] = file.name.split(".");
  const blob = file.slice(startByte, startByte + chunkSize);
  const blobName = `${fileName}_${index.value}.${fileType}`;
  const blobFile = new File([blob], blobName);
  console.log("上传中...", blobName);
  return blobFile;
};

const handleAbort = () => {
  // todo
  console.log("abort");
};
</script>
<style scoped></style>
