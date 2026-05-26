# webapp示例api-1

```javascript
// JavaScript 示例代码
const response = await fetch('https://api.bizyair.cn/w/v1/webapp/task/openapi/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
      "web_app_id": 54663,
      "suppress_preview_output": false,
      "input_values": {
        "6:CLIPTextEncode.text": "超远景，超广角。航拍全景。全身照。视角广阔。精细CG，绝世容颜美女，垂坠感，线条清晰，浅金色长发，发丝蓬松细腻，细腻肌理，写实逼真，1个性感的女人,3D渲染，长发及腰，淡红微嘟薄唇，正脸，异常巨大的胸部,巨乳,丰满自然的乳房,冷白皮，肤如凝脂，肌肤似雪。柔顺飘逸及腰长发，真实发丝质感，额头没有刘海，发丝根根分明，展现丰富色彩层次、细腻质感和真实光影。写实皮肤，妖冶，五官立体，唇色湿润，表情高冷、腹黑且帅气，眼神冷漠无情，佩戴极繁华丽细闪云母光泽的做工精细的饰品，画面光影真实，生物学发光，头发上装饰了无数金属流苏飘带，金属流苏飘带璀璨星河堆砌覆盖，神灵之资灵动与生机，浅色衣裙极繁华丽飘逸重工，弯弓射箭，姿态优美，质感真实，光影效果营造出氛围，整体兼具艺术幻想感，夸张的广角透视效果，耀光，反射，铺满高光点。凸显细腻肌理，背景为宏大的雾霾蓝玄幻暮光神殿，整体风格圣洁系列，色彩逼真, 鲜艳生动, 超广角, 超高清晰度, 8k分 辨率, 体积光，3D建模，真人写真，这身渐变珠宝，华丽珍贵渐变项链耳环手链戒指，身材，饱满，瓷肌玉肤，皮肤超细腻，闪亮发饰，雍容华贵，气质极佳，高贵大气，细腻浅金发，梦幻光，添加灵力光粒特效，水钻手链装饰。绝世妆容，五官极为华丽精致，华丽耳环项链。电影级写真，丰富艺术照。",
        "7:CLIPTextEncode.text": "模糊、丑陋、糟糕,畸形,多余的手指,多余的肢体,",
        "3:KSampler.steps": 9,
        "3:KSampler.sampler_name": "euler",
        "3:KSampler.scheduler": "simple",
        "28:EmptyLatentImage.width": 1080,
        "28:EmptyLatentImage.height": 1920,
        "30:Seed (rgthree).seed": -1
      }
    })
});

const result = await response.json();
console.log('生成结果:', result);
```

# webapp示例api-2

```javascript
// JavaScript 示例代码
const response = await fetch('https://api.bizyair.cn/w/v1/webapp/task/openapi/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
      "web_app_id": 54716,
      "suppress_preview_output": false,
      "input_values": {
        "23:LoraLoaderModelOnly.lora_name": "Kook_Zimage_瑶光.safetensors", // Kook_Zimage_瑶光.safetensors
        "23:LoraLoaderModelOnly.strength_model": 0.5000000000000001,
        "33:LoraLoaderModelOnly.lora_name": "Kook_Zimage_如梦似幻.safetensors", // Kook_Zimage_如梦似幻.safetensors
        "33:LoraLoaderModelOnly.strength_model": 0.7000000000000002,
        "49:CR Text.text": "自然真实的视觉风格，文艺电影构图，空灵氛围感，娇俏灵动少女，鹅蛋脸，清秀伶俐，精致眼眉，樱桃小口，额前细碎空气感齐刘海，小巧单螺髻顶点缀珍珠花钿，右侧鬓边垂着两绺可爱细长编发（扎丝带），皮肤白皙光滑又透亮，五官符合黄金比例，真实的皮肤质感。茶青色交领武侠风汉服，柔软布料暗纹质感。柳叶弯眉纤细舒展，爽朗表情，俏皮，杏眼，衣料为柔软棉麻质感，领口袖口饰有月白织金镶边，配色清新雅致，侧身，在古风客栈中，手持酒壶，伸直手臂向前要与人斗酒，四周簇拥着一群着各色交领武侠风汉服的江湖人士（有的凝神观看，有的与身边人窃窃私语，有的拍手叫好），前景束发背剑高大英俊侠士侧影失焦，暖调柔光包裹人物，情态生动自然，故事感，随机角度，随机运镜，柔焦美学，细腻肌理质感，情绪写意，艺术人像高级感。大光圈虚化营造高级电影质感。整体构图融合浪漫主义美学，突出人物立体轮廓与优雅气质。空灵的气氛，巧妙地捕捉情感，情绪叙事，整体氛围慵懒又随性，尽显松弛感，现场感，既视感，伦勃朗光，极强的光影对比，渐变美学，氛围感，故事感，复古胶片摄影，真实光影，复古色调，发黄老照片效果，富士滤镜，Kodak Portra 400胶片质感，_DSF1600.RAF效果，XF56mm F1.2镜头视角，IMG_2094.CR2质感，ins风，背景虚化，沉浸，文艺风格构图，细节丰富，强烈的视觉冲击力",
        "22:KSampler.seed": 645336705902829,
        "21:EmptyLatentImage.batch_size": 1,
        "60:INTConstant.value": 1280,
        "61:INTConstant.value": 1920
      }
    })
});

const result = await response.json();
console.log('生成结果:', result);
```

# webapp示例api-3

```javascript
// JavaScript 示例代码
const response = await fetch('https://api.bizyair.cn/w/v1/webapp/task/openapi/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
      "web_app_id": 54514,
      "suppress_preview_output": false,
      "input_values": {
        "41:LoadImage.image": "https://bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/20260507/OzMTYrAdMzrfe8zQoMEgdI4EYLoXGY3o.png",
        "126:LoadImage.image": "https://storage.bizyair.cn/inputs/20260521/N7UcY2XAW9EDjqvcRVwbXaGhjCLBydCW.png",
        "128:LoadImage.image": "https://storage.bizyair.cn/inputs/20260521/GENbCv609K5ddwGgk2OICkc2n5VxpXZE.webp",
        "112:TextEncodeQwenImageEditPlus.prompt": "图 1 的女人坐在图 2 的沙发上。沙发使用图 3 的图案材质花纹。",
        "125:EmptyLatentImage.width": 1080,
        "125:EmptyLatentImage.height": 1536
      }
    })
});

const result = await response.json();
console.log('生成结果:', result);
```