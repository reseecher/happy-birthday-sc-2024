// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data);
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // 检查是否已遍历到最后一个元素，准备开始动画
        if (dataArr.length === dataArr.indexOf(customData) + 1) {
          animationTimeline(); // 开始动画时间线
        }
      });
    });
};

const fetchPhotos = (onComplete) => {
  fetch("photos.json") // 从 photos.json 文件中获取照片列表
    .then(response => response.json())
    .then(data => {
      const photoGallery = document.querySelector(".photo-gallery"); // 照片展示容器
      const photoUrls = data.photos; // 照片列表

      // 清空容器，避免重复
      photoGallery.innerHTML = "";

      const tlPhotos = new TimelineMax({
        onComplete: onComplete // 照片展示完毕后继续后续动画
      });

      // 确保每张照片只展示一次，避免重复
      const shuffledPhotoUrls = photoUrls.sort(() => 0.5 - Math.random());

      // 依次展示每张照片，使用随机位置和淡入淡出效果
      shuffledPhotoUrls.forEach((photoUrl, index) => {
        const img = document.createElement("img");
        img.src = photoUrl;
        img.classList.add("photo");
        img.style.position = "absolute";
        img.style.opacity = 0;  // 初始不可见

        // 将图片元素添加到 photo-gallery 容器中
        photoGallery.appendChild(img);

        // 随机位置：让照片出现在屏幕的上方和中间区域
        const randomTop = Math.random() * 30 + 20;  // 20% ~ 50% 的 top 值，屏幕上方中部
        const randomLeft = Math.random() * 50 + 25; // 25% ~ 75% 的 left 值，屏幕中央偏左右

        // 淡入、保持一段时间、淡出
        tlPhotos
          .set(img, {
            top: `${randomTop}%`,
            left: `${randomLeft}%`,
            scale: Math.random() * 0.2 + 0.8 // 照片大小随机，保证不会太小（0.6 ~ 1.0 倍）
          })
          .to(img, 1, { opacity: 1, ease: Power2.easeInOut }) // 淡入
          .to(img, 0.7, { opacity: 1, ease: Power2.easeInOut }, "+=1") // 保持一段时间
          .to(img, 1, { opacity: 0, ease: Power2.easeInOut }, "-=0.5"); // 淡出，稍微有重叠
      });
    })
    .catch(error => {
      console.error("Error loading photos:", error);
    });
};


// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=3.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .add(() => {
      fetchPhotos(() => {
        tl.resume(); // 照片展示结束后恢复动画时间线
      });
      tl.pause(); // 在照片展示期间暂停时间线
    }, "+=1")
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=3"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400
      },
      {
        opacity: 1,
        y: -1000
      },
      0.2
    )
    .from(
      ".lydia-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Run fetch and animation in sequence
fetchData();