import React from 'react';
import {
  ResolutionRatioControls,
  WidthHeightQualityControls,
  SizeOnlyControls,
  FluxKontextControls,
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
  movementAmplitude,
  setMovementAmplitude,
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
  // wan-size 新增参数
  enableSequential,
  setEnableSequential,
  thinkingMode,
  setThinkingMode,
  colorPalette,
  setColorPalette,
  // vidu style
  style,
  setStyle,
  // resolution-ratio / width-height 新增参数
  batchSize,
  setBatchSize,
  webSearch,
  setWebSearch,
  returnLastFrame,
  setReturnLastFrame,
  topP,
  setTopP,
  // 阿里系新增参数
  audioSetting,
  setAudioSetting,
  drivingAudio,
  setDrivingAudio,
  audioUrl,
  setAudioUrl,
  referenceVoice,
  setReferenceVoice,
  bboxList,
  setBboxList,
  mode,
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
          seed={seed}
          setSeed={setSeed}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          supportsSeed={currentModel.supportsSeed}
          supportsWebSearch={currentModel.supportsWebSearch}
          supportsTemperature={currentModel.supportsTemperature}
          supportsTopP={currentModel.supportsTopP}
          supportsMaxTokens={currentModel.supportsMaxTokens}
          resolutionRequired={currentModel.resolutionRequired !== false}
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
    case 'flux-kontext':
      return (
        <FluxKontextControls
          currentRatios={currentRatios}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
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
          seed={seed}
          setSeed={setSeed}
          watermark={watermark}
          setWatermark={setWatermark}
          enableSequential={enableSequential}
          setEnableSequential={setEnableSequential}
          thinkingMode={thinkingMode}
          setThinkingMode={setThinkingMode}
          colorPalette={colorPalette}
          setColorPalette={setColorPalette}
          supportsSeed={currentModel.supportsSeed}
          supportsWatermark={currentModel.supportsWatermark}
          supportsEnableSequential={currentModel.supportsEnableSequential}
          supportsThinkingMode={currentModel.supportsThinkingMode}
          supportsColorPalette={currentModel.supportsColorPalette}
          supportsBboxList={currentModel.supportsBboxList}
          bboxList={bboxList}
          setBboxList={setBboxList}
          mode={mode}
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
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          seed={seed}
          setSeed={setSeed}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          supportsNegativePrompt={currentModel.supportsNegativePrompt}
          supportsSeed={currentModel.supportsSeed}
          supportsBatchSize={currentModel.supportsBatchSize}
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
          supportsSeed={currentModel.supportsSeed}
          supportsReturnLastFrame={currentModel.supportsReturnLastFrame}
          supportsWebSearch={currentModel.supportsWebSearch}
          webSearch={webSearch}
          setWebSearch={setWebSearch}
          returnLastFrame={returnLastFrame}
          setReturnLastFrame={setReturnLastFrame}
          minDuration={currentModel.minDuration}
          mode={mode}
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
          multiPrompt={multiPrompt}
          setMultiPrompt={setMultiPrompt}
          seed={seed}
          setSeed={setSeed}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          supportsMultiShot={currentModel.supportsMultiShot}
          supportsSeed={currentModel.supportsSeed}
          mode={mode}
          soundRequired={currentModel.soundRequired}
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
          supportsSeed={currentModel.supportsSeed}
          movementAmplitude={movementAmplitude}
          setMovementAmplitude={setMovementAmplitude}
          supportsMovementAmplitude={currentModel.supportsMovementAmplitude}
          supportsIsRec={currentModel.supportsIsRec}
          style={style}
          setStyle={setStyle}
          styleOptions={currentModel.styleOptions}
          mode={mode}
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
          audioSetting={audioSetting}
          setAudioSetting={setAudioSetting}
          drivingAudio={drivingAudio}
          setDrivingAudio={setDrivingAudio}
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          referenceVoice={referenceVoice}
          setReferenceVoice={setReferenceVoice}
          supportsAudioSetting={currentModel.supportsAudioSetting}
          supportsDrivingAudio={currentModel.supportsDrivingAudio}
          supportsAudioUrl={currentModel.supportsAudioUrl}
          supportsRefImages={currentModel.supportsRefImages}
          supportsRefVideos={currentModel.supportsRefVideos}
          supportsReferenceVoice={currentModel.supportsReferenceVoice}
          mode={mode}
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
          audioUrl={audioUrl}
          setAudioUrl={setAudioUrl}
          supportsPromptExtend={currentModel.supportsPromptExtend}
          supportsAudio={currentModel.supportsAudio}
          supportsAudioUrl={currentModel.supportsAudioUrl}
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
          supportsFastPretreatment={currentModel.supportsFastPretreatment}
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
          audioSetting={audioSetting}
          setAudioSetting={setAudioSetting}
          supportsAudioSetting={currentModel.supportsAudioSetting}
          mode={mode}
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
          mode={mode}
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
          maxSystemPromptLength={currentModel.maxSystemPromptLength}
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
