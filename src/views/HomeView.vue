<script lang="ts">

</script>

<template>
  <div id="CurrentSite" class="h-screen w-screen p-0 m-0 absolute left-0 top-0">


    <div class="homepage">
      <h1 class="homepage_title">Welcome to LLM 2 Leaf.</h1>
    </div>
    <div class="main_title">
      <p class="main_title_text1">
        Choose Your LLM:
      </p>
      <RouterLink to="/chat">
        <div class="main_title_textbox1">
          <img src="/deepseek.png" alt="Deepseek Logo" class="deepseek_logo">
          <p class="deepseek_text">Deepseek</p>
        </div>
        <div class="main_title_textbox2">
          <img src="/Claude.png" alt="ClaudeAI logo" class="ClaudeAI_logo">
          <p class="ClaudeAI_text">ClaudeAI</p>
        </div>
        <div class="main_title_textbox3">
          <img src="/ChatGPT-Logo.png" alt="ChatGPT Logo" class="chatGPT_logo">
          <p class="ChatGPT_text">ChatGPT</p>
        </div>
      </RouterLink>
    </div>
    <div class="about_us">
      <h1 class="about_title">Our Mission</h1>
      <p class="about_text">In summary, our mission is to reduce the carbon
        footprint of LLMs, so that it has a net percentage of 0%.
        By tracking the CO₂ emissions generated from each interaction, we provide
        users with a transparent view of their
        environmental impact. To counteract this, we offer the option to
        contribute towards tree planting initiatives, ensuring
        that every usage can be offset in a meaningful and sustainable way. </p>
    </div>


  </div>
</template>

<style scoped>
.main_title {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 2px solid black;
  margin-top: 140px;
  margin-left: 35%;
  margin-right: 35%;
  background-color: rgba(255, 255, 255, 0.645);
  height: 290px;
}

.main_title_text1 {
  text-align: center;
  font-size: 18px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.main_title_textbox1,
.main_title_textbox2,
.main_title_textbox3 {
  border-radius: 25px;
  border: 0.5px solid black;
  width: 100%;
  height: 70px;
  padding: 0px 100px;
}

.main_title_textbox1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 10px;
}

.main_title_textbox1:hover,
.main_title_textbox2:hover,
.main_title_textbox3:hover {
  background-color: rgb(164, 164, 164)
}

.deepseek_logo {
  width: 55.5px;
  height: 34px;
  border-radius: 100px;
  margin-left: 9px;
  margin-right: 6px;

}

.deepseek_text {
  width: auto;
  font-size: 17px;
  text-align: center;
}

.main_title_textbox3 {
  margin-bottom: 24.8px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.chatGPT_logo {
  width: 70px;
  height: 40px;
}

.chatGPT_text {
  margin-top: 16px;
  margin-left: 20px;
  margin-bottom: 16px;
  height: 40px;
  font-size: 17px;
}

.main_title_textbox2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
}

.ClaudeAI_logo {
  width: 36px;
  height: 36px;
  margin-right: 12px;
  margin-left: 17px;

}

.ClaudeAI_text {
  font-size: 17px;
  margin-left: 4px;
}

.homepage_title {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 60px;
  font-weight: bold;
  font-size: x-large;
}

.forest {
  position: relative;
  z-index: 1;
  margin: 0;

}

#CurrentSite {
  background-image: url('/Forest.webp');
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  padding-bottom: 0;
}

.about_us {
  margin-top: 200px;
  text-align: start;
  background-image: linear-gradient(rgba(128, 171, 118, 0.652), rgba(41, 112, 19, 0.537));
  height: 300px;
  padding-top: 5px;
}

.about_title {
  padding: 40px 0px 40px 40px;
  color: rgb(231, 231, 231);
  font-size: x-large;
  font-weight: bold;
}

.about_text {
  font-size: 19px;
  color: white;
  padding-left: 40px;
  padding-right: 40px;

}
</style>
