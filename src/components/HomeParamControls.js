import React from 'react';
import {
  ResolutionRatioControls,
  WidthHeightQualityControls,
  SizeOnlyControls,
  WanSizeControls,
  WidthHeightControls,
} from './ParamControls';
import {
  SeedanceVideoControls,
  KlingVideoControls,
  KlingO34KControls,
  ViduVideoControls,
  WanVideoControls,
  WanI2VControls,
  HailuoVideoControls,
  HappyHorseVideoControls,
  LtxVideoControls,
  BzaVideoXControls,
  BzaVideoV3Controls,
  DreamActorControls,
} from './VideoParamControls';
import { LLMChatControls } from './LLMControls';
import { VisionGControls, JoyCaptionControls } from './VisionParamControls';
import { TTSControls } from './TTSControls';

/**
 * 根据当前模型的 paramType 渲染对应的参数控件。
 * 所有状态由 HomeScreen 通过 props 传入，本组件不持有状态。
 *
 * ⚠️ 同步风险：本组件的 switch(paramType) 与 HomeScreen.getPayloadParams 的
 * switch(paramType) 需要保持同步。新增 paramType 时必须同时修改两处。
 */
export function HomeParamControls({
  paramType,
  currentModel,
  currentResolutions,
  currentRatios,
  // 图片模型参数
  resolution,
  setResolution,
  aspectRatio,
  setAspectRatio,
  quality,
  setQuality,
  sizePreset,
  setSizePreset,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  // 视频模型参数
  duration,
  setDuration,
  generateAudio,
  setGenerateAudio,
  seed,
  setSeed,
  sound,
  setSound,
  multiShot,
  setMultiShot,
  shotType,
  setShotType,
  multiPrompt,
  setMultiPrompt,
  keepOriginalSound,
  setKeepOriginalSound,
  negativePrompt,
  setNegativePrompt,
  promptExtend,
  setPromptExtend,
  watermark,
  setWatermark,
  display,
  setDisplay,
  audio,
  setAudio,
  offPeak,
  setOffPeak,
  isRec,
  setIsRec,
  promptOptimizer,
  setPromptOptimizer,
  fastPretreatment,
  setFastPretreatment,
  aigcWatermark,
  setAigcWatermark,
  // LLM 参数
  systemPrompt,
  setSystemPrompt,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  enableThinking,
  setEnableThinking,
  enableSearch,
  setEnableSearch,
  // Vision 参数
  detail,
  setDetail,
  captionType,
  setCaptionType,
  captionLength,
  setCaptionLength,
  doSample,
  setDoSample,
  extraOptions,
  setExtraOptions,
  nameInput,
  setNameInput,
  customPrompt,
  setCustomPrompt,
  // TTS 参数
  voice,
  setVoice,
  responseFormat,
  setResponseFormat,
  instructions,
  setInstructions,
  language,
  setLanguage,
  speed,
  setSpeed,
}) {
  switch (paramType) {
    case 'resolution-ratio':
      return (
        <ResolutionRatioControls
          currentResolutions={currentResolutions}
          currentRatios={currentRatios}
          resolution={resolution}
          aspectRatio={aspectRatio}
          setResolution={setResolution}
          setAspectRatio={setAspectRatio}
        />
      );
    case 'width-height-quality':
      return (
        <WidthHeightQualityControls
          sizePreset={sizePreset}
          setSizePreset={setSizePreset}
          customWidth={customWidth}
          setCustomWidth={setCustomWidth}
          customHeight={customHeight}
          setCustomHeight={setCustomHeight}
          quality={quality}
          setQuality={setQuality}
          modelQualities={currentModel.qualities}
        />
      );
    case 'size-only':
      return (
        <SizeOnlyControls
          currentResolutions={currentResolutions}
          resolution={resolution}
          setResolution={setResolution}
        />
      );
    case 'wan-size':
      return (
        <WanSizeControls
          currentResolutions={currentResolutions}
          resolution={resolution}
          setResolution={setResolution}
          customWidth={customWidth}
          setCustomWidth={setCustomWidth}
          customHeight={customHeight}
          setCustomHeight={setCustomHeight}
        />
      );
    case 'width-height':
      return (
        <WidthHeightControls
          sizePreset={sizePreset}
          setSizePreset={setSizePreset}
          customWidth={customWidth}
          setCustomWidth={setCustomWidth}
          customHeight={customHeight}
          setCustomHeight={setCustomHeight}
        />
      );
    case 'seedance-video':
      return (
        <SeedanceVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          generateAudio={generateAudio}
          setGenerateAudio={setGenerateAudio}
          seed={seed}
          setSeed={setSeed}
          supportsAudio={currentModel.supportsAudio}
          minDuration={currentModel.minDuration}
        />
      );
    case 'kling-video':
      return (
        <KlingVideoControls
          videoRatios={currentRatios}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          sound={sound}
          setSound={setSound}
          multiShot={multiShot}
          setMultiShot={setMultiShot}
          shotType={shotType}
          setShotType={setShotType}
          seed={seed}
          setSeed={setSeed}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          supportsMultiShot={currentModel.supportsMultiShot}
          supportsSeed={currentModel.supportsSeed}
        />
      );
    case 'kling-o3-4k':
      return (
        <KlingO34KControls
          videoRatios={currentRatios}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          sound={sound}
          setSound={setSound}
          keepOriginalSound={keepOriginalSound}
          setKeepOriginalSound={setKeepOriginalSound}
          multiShot={multiShot}
          setMultiShot={setMultiShot}
          shotType={shotType}
          setShotType={setShotType}
          multiPrompt={multiPrompt}
          setMultiPrompt={setMultiPrompt}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          supportsMultiShot={currentModel.supportsMultiShot}
        />
      );
    case 'vidu-video':
      return (
        <ViduVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          audio={audio}
          setAudio={setAudio}
          isRec={isRec}
          setIsRec={setIsRec}
          offPeak={offPeak}
          setOffPeak={setOffPeak}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          supportsAudio={currentModel.supportsAudio}
          supportsOffPeak={currentModel.supportsOffPeak}
          seed={seed}
          setSeed={setSeed}
        />
      );
    case 'wan-video':
      return (
        <WanVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          promptExtend={promptExtend}
          setPromptExtend={setPromptExtend}
          watermark={watermark}
          setWatermark={setWatermark}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          seed={seed}
          setSeed={setSeed}
          supportsPromptExtend={currentModel.supportsPromptExtend}
          supportsWatermark={currentModel.supportsWatermark}
          supportsNegativePrompt={currentModel.supportsNegativePrompt}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
        />
      );
    case 'wan-i2v':
      return (
        <WanI2VControls
          resolutions={currentResolutions}
          resolution={resolution}
          setResolution={setResolution}
          duration={duration}
          setDuration={setDuration}
          promptExtend={promptExtend}
          setPromptExtend={setPromptExtend}
          audio={audio}
          setAudio={setAudio}
          supportsPromptExtend={currentModel.supportsPromptExtend}
          supportsAudio={currentModel.supportsAudio}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
        />
      );
    case 'hailuo-video':
      return (
        <HailuoVideoControls
          resolutions={currentResolutions}
          durationOptions={currentModel.durationOptions || [6, 10]}
          resolutionDurationMap={currentModel.resolutionDurationMap}
          resolution={resolution}
          setResolution={setResolution}
          duration={duration}
          setDuration={setDuration}
          promptOptimizer={promptOptimizer}
          setPromptOptimizer={setPromptOptimizer}
          fastPretreatment={fastPretreatment}
          setFastPretreatment={setFastPretreatment}
          aigcWatermark={aigcWatermark}
          setAigcWatermark={setAigcWatermark}
          supportsPromptOptimizer={currentModel.supportsPromptOptimizer}
          supportsWatermark={currentModel.supportsWatermark}
        />
      );
    case 'happyhorse-video':
      return (
        <HappyHorseVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          watermark={watermark}
          setWatermark={setWatermark}
          supportsWatermark={currentModel.supportsWatermark}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          seed={seed}
          setSeed={setSeed}
        />
      );
    case 'ltx-video':
      return (
        <LtxVideoControls
          display={display}
          setDisplay={setDisplay}
          displayOptions={currentModel.displayOptions || ['horizontal', 'vertical']}
          seed={seed}
          setSeed={setSeed}
        />
      );
    case 'bza-video-x':
      return (
        <BzaVideoXControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          durationOptions={currentModel.durationOptions}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
        />
      );
    case 'bza-video-v3':
      return (
        <BzaVideoV3Controls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={resolution}
          setResolution={setResolution}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
        />
      );
    case 'dreamactor':
      return <DreamActorControls />;
    case 'llm-chat':
      return (
        <LLMChatControls
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          enableThinking={enableThinking}
          setEnableThinking={setEnableThinking}
          enableSearch={enableSearch}
          setEnableSearch={setEnableSearch}
          enableThinkingRequired={currentModel.enableThinkingRequired}
          enableSearchRequired={currentModel.enableSearchRequired}
        />
      );
    case 'vision-g':
      return (
        <VisionGControls
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          detail={detail}
          setDetail={setDetail}
          enableThinking={enableThinking}
          setEnableThinking={setEnableThinking}
          detailOptions={currentModel.detailOptions}
        />
      );
    case 'joycaption':
      return (
        <JoyCaptionControls
          captionType={captionType}
          setCaptionType={setCaptionType}
          captionLength={captionLength}
          setCaptionLength={setCaptionLength}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          doSample={doSample}
          setDoSample={setDoSample}
          extraOptions={extraOptions}
          setExtraOptions={setExtraOptions}
          nameInput={nameInput}
          setNameInput={setNameInput}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          captionTypes={currentModel.captionTypes}
          captionLengths={currentModel.captionLengths}
        />
      );
    case 'tts':
      return (
        <TTSControls
          voice={voice}
          setVoice={setVoice}
          responseFormat={responseFormat}
          setResponseFormat={setResponseFormat}
          instructions={instructions}
          setInstructions={setInstructions}
          language={language}
          setLanguage={setLanguage}
          speed={speed}
          setSpeed={setSpeed}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          voices={currentModel.voices}
          formats={currentModel.formats}
          languages={currentModel.languages}
          speedRange={currentModel.speedRange}
          maxTokensMax={currentModel.maxTokens}
        />
      );
    default:
      return null;
  }
}
