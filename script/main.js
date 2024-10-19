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

const generateOptimalPosition = (existingPositions, imgWidth, imgHeight, viewportWidth, viewportHeight) => {
  let bestPosition = null;
  let smallestOverlap = Infinity;

  for (let i = 0; i < 100; i++) {  // 尝试生成多个位置，找到重叠最小的
    const top = Math.random() * (viewportHeight - imgHeight); // 确保图片在视口范围内
    const left = Math.random() * (viewportWidth - imgWidth);  // 确保图片在视口范围内

    // 计算与现有图片的重叠面积
    let totalOverlap = 0;
    for (let pos of existingPositions) {
      const dx = Math.max(0, Math.min(pos.left + pos.width, left + imgWidth) - Math.max(pos.left, left));
      const dy = Math.max(0, Math.min(pos.top + pos.height, top + imgHeight) - Math.max(pos.top, top));
      totalOverlap += dx * dy;  // 重叠面积
    }

    // 如果当前位置的重叠面积最小，则记录此位置
    if (totalOverlap < smallestOverlap) {
      smallestOverlap = totalOverlap;
      bestPosition = { top, left };
    }
  }

  return bestPosition;
};

// 读取并展示照片
const fetchPhotos = (onComplete) => {
  fetch("photos.json") // 从 photos.json 文件中获取照片列表
    .then(response => response.json())
    .then(data => {
      const photoUrls = data.photos; // 照片列表
      const photoGallery = document.querySelector(".photo-gallery"); // 照片展示容器
      const viewportWidth = window.innerWidth; // 视口宽度
      const viewportHeight = window.innerHeight; // 视口高度

      // 清空容器，避免重复
      photoGallery.innerHTML = "";

      let currentIndex = 0; // 当前显示的照片索引
      let lastDisplayTime = 0; // 记录最后一张照片展示的时间
      const existingPositions = []; // 用于存储已使用的位置

      const showNextPhoto = () => {
        if (currentIndex < photoUrls.length) {
          const img = new Image();
          img.src = photoUrls[currentIndex];

          img.onload = () => {
            const now = Date.now();
            const timeSinceLastDisplay = now - lastDisplayTime;
            const delay = Math.max(1000 - timeSinceLastDisplay, 0); // 保证间隔至少为0.5秒

            setTimeout(() => {
              const imgWidth = img.naturalWidth;  // 获取图片的原始宽度
              const imgHeight = img.naturalHeight; // 获取图片的原始高度

              // 找到重叠最小的位置
              const { top, left } = generateOptimalPosition(existingPositions, imgWidth, imgHeight, viewportWidth, viewportHeight);
              existingPositions.push({ top, left, width: imgWidth, height: imgHeight }); // 记录图片的位置和尺寸

              img.classList.add("photo");
              img.style.position = "absolute";
              img.style.top = `${top}px`; // 使用像素单位，保持图片原始大小
              img.style.left = `${left}px`;

              // 将图片插入到 photo-gallery 容器中
              photoGallery.appendChild(img);

              currentIndex++; // 显示下一张照片
              lastDisplayTime = Date.now(); // 更新最后展示时间

              // 加载并展示下一张照片
              showNextPhoto();
            }, delay);
          };
        } else {
          // 所有图片加载并显示完毕后，等待 2 秒再清空并继续动画
          setTimeout(() => {
            photoGallery.innerHTML = ''; // 清空容器，移除所有图片
            onComplete(); // 所有照片显示完毕后，继续执行其他动画
          }, 2000); // 等待 2 秒后消失
        }
      };

      // 开始展示第一张照片
      showNextPhoto();
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
    .add(() => {
      fetchPhotos(() => {
        tl.resume(); // 照片展示结束后恢复动画时间线
      });
      tl.pause(); // 在照片展示期间暂停时间线
    }, "+=0.0")
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