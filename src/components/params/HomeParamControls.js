import React, { useCallback } from 'react';
import {
  ResolutionRatioControls,
  WidthHeightQualityControls,
  SizeOnlyControls,
  FluxKontextControls,
  WanSizeControls,
  WidthHeightControls,
  QwenImageControls,
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
  BzaVideoGControls,
  DreamActorControls,
} from './VideoParamControls';
import { LLMChatControls } from './LLMControls';
import { VisionGControls, JoyCaptionControls } from './VisionParamControls';
import { TTSControls } from './TTSControls';
import { BirefnetControls } from './BirefnetControls';
import { AceStepControls } from './AceStepControls';
import { Seedvr2Controls } from './Seedvr2Controls';
import { FluxKleinControls } from './FluxKleinControls';
import { KontextLoraControls } from './KontextLoraControls';

function HomeParamControlsInner({
  paramType,
  currentModel,
  currentResolutions,
  currentRatios,
  state,
  dispatch,
  mode,
}) {
  const s = useCallback((field) => (v) => dispatch({ type: 'SET_FIELD', field, value: v }), [dispatch]);

  switch (paramType) {
    case 'resolution-ratio':
      return (
        <ResolutionRatioControls
          currentResolutions={currentResolutions}
          currentRatios={currentRatios}
          resolution={state.resolution}
          aspectRatio={state.aspectRatio}
          setResolution={s('resolution')}
          setAspectRatio={s('aspectRatio')}
          seed={state.seed}
          setSeed={s('seed')}
          webSearch={state.webSearch}
          setWebSearch={s('webSearch')}
          temperature={state.temperature}
          setTemperature={s('temperature')}
          topP={state.topP}
          setTopP={s('topP')}
          maxTokens={state.maxTokens}
          setMaxTokens={s('maxTokens')}
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
          sizePreset={state.sizePreset}
          setSizePreset={s('sizePreset')}
          customWidth={state.customWidth}
          setCustomWidth={s('customWidth')}
          customHeight={state.customHeight}
          setCustomHeight={s('customHeight')}
          quality={state.quality}
          setQuality={s('quality')}
          modelQualities={currentModel.qualities}
        />
      );
    case 'size-only':
      return (
        <SizeOnlyControls
          currentResolutions={currentResolutions}
          resolution={state.resolution}
          setResolution={s('resolution')}
        />
      );
    case 'flux-kontext':
      return (
        <FluxKontextControls
          currentRatios={currentRatios}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
        />
      );
    case 'wan-size':
      return (
        <WanSizeControls
          currentResolutions={currentResolutions}
          resolution={state.resolution}
          setResolution={s('resolution')}
          customWidth={state.customWidth}
          setCustomWidth={s('customWidth')}
          customHeight={state.customHeight}
          setCustomHeight={s('customHeight')}
          seed={state.seed}
          setSeed={s('seed')}
          watermark={state.watermark}
          setWatermark={s('watermark')}
          enableSequential={state.enableSequential}
          setEnableSequential={s('enableSequential')}
          thinkingMode={state.thinkingMode}
          setThinkingMode={s('thinkingMode')}
          colorPalette={state.colorPalette}
          setColorPalette={s('colorPalette')}
          supportsSeed={currentModel.supportsSeed}
          supportsWatermark={currentModel.supportsWatermark}
          supportsEnableSequential={currentModel.supportsEnableSequential}
          supportsThinkingMode={currentModel.supportsThinkingMode}
          supportsColorPalette={currentModel.supportsColorPalette}
          supportsBboxList={currentModel.supportsBboxList}
          bboxList={state.bboxList}
          setBboxList={s('bboxList')}
          mode={mode}
        />
      );
    case 'width-height':
      return (
        <WidthHeightControls
          sizePreset={state.sizePreset}
          setSizePreset={s('sizePreset')}
          customWidth={state.customWidth}
          setCustomWidth={s('customWidth')}
          customHeight={state.customHeight}
          setCustomHeight={s('customHeight')}
          negativePrompt={state.negativePrompt}
          setNegativePrompt={s('negativePrompt')}
          seed={state.seed}
          setSeed={s('seed')}
          batchSize={state.batchSize}
          setBatchSize={s('batchSize')}
          supportsNegativePrompt={currentModel.supportsNegativePrompt}
          supportsSeed={currentModel.supportsSeed}
          supportsBatchSize={currentModel.supportsBatchSize}
          steps={state.steps}
          setSteps={s('steps')}
          guidanceScale={state.guidanceScale}
          setGuidanceScale={s('guidanceScale')}
          stepsRange={currentModel.stepsRange}
          defaultSteps={currentModel.defaultSteps}
          guidanceScaleRange={currentModel.guidanceScaleRange}
          defaultGuidanceScale={currentModel.defaultGuidanceScale}
        />
      );
    case 'seedance-video':
      return (
        <SeedanceVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          generateAudio={state.generateAudio}
          setGenerateAudio={s('generateAudio')}
          seed={state.seed}
          setSeed={s('seed')}
          supportsAudio={currentModel.supportsAudio}
          supportsSeed={currentModel.supportsSeed}
          supportsReturnLastFrame={currentModel.supportsReturnLastFrame}
          supportsWebSearch={currentModel.supportsWebSearch}
          webSearch={state.webSearch}
          setWebSearch={s('webSearch')}
          returnLastFrame={state.returnLastFrame}
          setReturnLastFrame={s('returnLastFrame')}
          minDuration={currentModel.minDuration}
          mode={mode}
        />
      );
    case 'kling-video':
      return (
        <KlingVideoControls
          videoRatios={currentRatios}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          sound={state.sound}
          setSound={s('sound')}
          multiShot={state.multiShot}
          setMultiShot={s('multiShot')}
          shotType={state.shotType}
          setShotType={s('shotType')}
          multiPrompt={state.multiPrompt}
          setMultiPrompt={s('multiPrompt')}
          seed={state.seed}
          setSeed={s('seed')}
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
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          sound={state.sound}
          setSound={s('sound')}
          keepOriginalSound={state.keepOriginalSound}
          setKeepOriginalSound={s('keepOriginalSound')}
          multiShot={state.multiShot}
          setMultiShot={s('multiShot')}
          shotType={state.shotType}
          setShotType={s('shotType')}
          multiPrompt={state.multiPrompt}
          setMultiPrompt={s('multiPrompt')}
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
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          audio={state.audio}
          setAudio={s('audio')}
          isRec={state.isRec}
          setIsRec={s('isRec')}
          offPeak={state.offPeak}
          setOffPeak={s('offPeak')}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          supportsAudio={currentModel.supportsAudio}
          supportsOffPeak={currentModel.supportsOffPeak}
          seed={state.seed}
          setSeed={s('seed')}
          supportsSeed={currentModel.supportsSeed}
          movementAmplitude={state.movementAmplitude}
          setMovementAmplitude={s('movementAmplitude')}
          supportsMovementAmplitude={currentModel.supportsMovementAmplitude}
          supportsIsRec={currentModel.supportsIsRec}
          style={state.style}
          setStyle={s('style')}
          styleOptions={currentModel.styleOptions}
          mode={mode}
        />
      );
    case 'wan-video':
      return (
        <WanVideoControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          promptExtend={state.promptExtend}
          setPromptExtend={s('promptExtend')}
          watermark={state.watermark}
          setWatermark={s('watermark')}
          negativePrompt={state.negativePrompt}
          setNegativePrompt={s('negativePrompt')}
          seed={state.seed}
          setSeed={s('seed')}
          supportsPromptExtend={currentModel.supportsPromptExtend}
          supportsWatermark={currentModel.supportsWatermark}
          supportsNegativePrompt={currentModel.supportsNegativePrompt}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          audioSetting={state.audioSetting}
          setAudioSetting={s('audioSetting')}
          drivingAudio={state.drivingAudio}
          setDrivingAudio={s('drivingAudio')}
          audioUrl={state.audioUrl}
          setAudioUrl={s('audioUrl')}
          referenceVoice={state.referenceVoice}
          setReferenceVoice={s('referenceVoice')}
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
          resolution={state.resolution}
          setResolution={s('resolution')}
          duration={state.duration}
          setDuration={s('duration')}
          promptExtend={state.promptExtend}
          setPromptExtend={s('promptExtend')}
          audio={state.audio}
          setAudio={s('audio')}
          audioUrl={state.audioUrl}
          setAudioUrl={s('audioUrl')}
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
          resolution={state.resolution}
          setResolution={s('resolution')}
          duration={state.duration}
          setDuration={s('duration')}
          promptOptimizer={state.promptOptimizer}
          setPromptOptimizer={s('promptOptimizer')}
          fastPretreatment={state.fastPretreatment}
          setFastPretreatment={s('fastPretreatment')}
          aigcWatermark={state.aigcWatermark}
          setAigcWatermark={s('aigcWatermark')}
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
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          watermark={state.watermark}
          setWatermark={s('watermark')}
          supportsWatermark={currentModel.supportsWatermark}
          maxDuration={currentModel.maxDuration}
          minDuration={currentModel.minDuration}
          seed={state.seed}
          setSeed={s('seed')}
          audioSetting={state.audioSetting}
          setAudioSetting={s('audioSetting')}
          supportsAudioSetting={currentModel.supportsAudioSetting}
          mode={mode}
        />
      );
    case 'ltx-video':
      return (
        <LtxVideoControls
          display={state.display}
          setDisplay={s('display')}
          displayOptions={currentModel.displayOptions || ['horizontal', 'vertical']}
          seed={state.seed}
          setSeed={s('seed')}
        />
      );
    case 'bza-video-x':
      return (
        <BzaVideoXControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
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
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          durationOptions={currentModel.durationOptions}
          generateAudio={state.generateAudio}
          setGenerateAudio={s('generateAudio')}
          seed={state.seed}
          setSeed={s('seed')}
          negativePrompt={state.negativePrompt}
          setNegativePrompt={s('negativePrompt')}
          supportsAudio={currentModel.supportsAudio}
          supportsSeed={currentModel.supportsSeed}
          supportsNegativePrompt={currentModel.supportsNegativePrompt}
          mode={mode}
        />
      );
    case 'bza-video-g':
      return (
        <BzaVideoGControls
          resolutions={currentResolutions}
          videoRatios={currentRatios}
          resolution={state.resolution}
          setResolution={s('resolution')}
          aspectRatio={state.aspectRatio}
          setAspectRatio={s('aspectRatio')}
          duration={state.duration}
          setDuration={s('duration')}
          durationOptions={currentModel.durationOptions}
          mode={mode}
        />
      );
    case 'qwen-image':
      return (
        <QwenImageControls
          customWidth={state.customWidth}
          setCustomWidth={s('customWidth')}
          customHeight={state.customHeight}
          setCustomHeight={s('customHeight')}
          steps={state.steps}
          setSteps={s('steps')}
          guidanceScale={state.guidanceScale}
          setGuidanceScale={s('guidanceScale')}
          negativePrompt={state.negativePrompt}
          setNegativePrompt={s('negativePrompt')}
          seed={state.seed}
          setSeed={s('seed')}
        />
      );
    case 'dreamactor':
      return <DreamActorControls />;
    case 'llm-chat':
      return (
        <LLMChatControls
          systemPrompt={state.systemPrompt}
          setSystemPrompt={s('systemPrompt')}
          temperature={state.temperature}
          setTemperature={s('temperature')}
          maxTokens={state.maxTokens}
          setMaxTokens={s('maxTokens')}
          enableThinking={state.enableThinking}
          setEnableThinking={s('enableThinking')}
          enableSearch={state.enableSearch}
          setEnableSearch={s('enableSearch')}
          enableThinkingRequired={currentModel.enableThinkingRequired}
          enableSearchRequired={currentModel.enableSearchRequired}
        />
      );
    case 'vision-g':
      return (
        <VisionGControls
          systemPrompt={state.systemPrompt}
          setSystemPrompt={s('systemPrompt')}
          temperature={state.temperature}
          setTemperature={s('temperature')}
          maxTokens={state.maxTokens}
          setMaxTokens={s('maxTokens')}
          detail={state.detail}
          setDetail={s('detail')}
          enableThinking={state.enableThinking}
          setEnableThinking={s('enableThinking')}
          detailOptions={currentModel.detailOptions}
          maxSystemPromptLength={currentModel.maxSystemPromptLength}
        />
      );
    case 'joycaption':
      return (
        <JoyCaptionControls
          captionType={state.captionType}
          setCaptionType={s('captionType')}
          captionLength={state.captionLength}
          setCaptionLength={s('captionLength')}
          temperature={state.temperature}
          setTemperature={s('temperature')}
          maxTokens={state.maxTokens}
          setMaxTokens={s('maxTokens')}
          doSample={state.doSample}
          setDoSample={s('doSample')}
          extraOptions={state.extraOptions}
          setExtraOptions={s('extraOptions')}
          nameInput={state.nameInput}
          setNameInput={s('nameInput')}
          customPrompt={state.customPrompt}
          setCustomPrompt={s('customPrompt')}
          captionTypes={currentModel.captionTypes}
          captionLengths={currentModel.captionLengths}
        />
      );
    case 'tts':
      return (
        <TTSControls
          voice={state.voice}
          setVoice={s('voice')}
          responseFormat={state.responseFormat}
          setResponseFormat={s('responseFormat')}
          instructions={state.instructions}
          setInstructions={s('instructions')}
          language={state.language}
          setLanguage={s('language')}
          speed={state.speed}
          setSpeed={s('speed')}
          maxTokens={state.maxTokens}
          setMaxTokens={s('maxTokens')}
          voices={currentModel.voices}
          formats={currentModel.formats}
          languages={currentModel.languages}
          speedRange={currentModel.speedRange}
          maxTokensMax={currentModel.maxTokens}
        />
      );
    case 'birefnet':
      return (
        <BirefnetControls
          outputmask={state.outputmask}
          setOutputmask={s('outputmask')}
        />
      );
    case 'ace-step':
      return (
        <AceStepControls
          lyrics={state.lyrics}
          setLyrics={s('lyrics')}
          tags={state.tags}
          setTags={s('tags')}
          duration={state.duration}
          setDuration={s('duration')}
          seed={state.seed}
          setSeed={s('seed')}
          durationRange={currentModel.durationRange}
          defaultDuration={currentModel.defaultDuration}
        />
      );
    case 'seedvr2':
      return (
        <Seedvr2Controls
          resolution={state.resolution}
          setResolution={s('resolution')}
          resolutions={currentModel.resolutions}
        />
      );
    case 'flux-klein':
      return <FluxKleinControls />;
    case 'kontext-lora':
      return (
        <KontextLoraControls
          seed={state.seed}
          setSeed={s('seed')}
        />
      );
    default:
      return null;
  }
}

export const HomeParamControls = React.memo(HomeParamControlsInner);
