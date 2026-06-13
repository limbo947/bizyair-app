import React from 'react';
import { Pressable, Text, View, TextInput, Switch } from 'react-native';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { ParamLabel } from './ParamLabel';

function useStyles() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  return { styles, colors };
}

export function SeedanceVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  generateAudio, setGenerateAudio, seed, setSeed,
  supportsAudio, minDuration, supportsSeed, supportsReturnLastFrame,
  supportsWebSearch, webSearch, setWebSearch, returnLastFrame, setReturnLastFrame,
  mode,
}) {
  const { styles, colors } = useStyles();
  const min = minDuration || 4;
  const durationOptions = ['auto'];
  for (let i = min; i <= 15; i++) durationOptions.push(String(i));

  // 根据模式和文档判断必选/可选
  // resolution 和 duration 在 base 版本中是必选，在 official 版本中是可选
  // prompt 在 text-to-video 中必选，在 flf/reference 中部分可选
  const isResolutionRequired = mode !== 'text-to-video' ? false : true;
  const isDurationRequired = mode !== 'text-to-video' ? false : true;

  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="宽高比" required={false} />
        <View style={styles.ratioGrid}>
          {videoRatios.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, aspectRatio === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required={isDurationRequired} />
        <View style={styles.selectorRow}>
          {durationOptions.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required={isResolutionRequired} />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {supportsAudio && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setGenerateAudio(!generateAudio)}>
            <ParamLabel label="生成音频" required={false} style={{ marginBottom: 0 }} />
            <Switch value={generateAudio} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsWebSearch && mode === 'text-to-video' && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setWebSearch(!webSearch)}>
            <ParamLabel label="联网搜索" required={false} style={{ marginBottom: 0 }} />
            <Switch value={webSearch} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsReturnLastFrame && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setReturnLastFrame(!returnLastFrame)}>
            <ParamLabel label="返回尾帧" required={false} style={{ marginBottom: 0 }} />
            <Switch value={returnLastFrame} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="0 ~ 2147483647，-1 为随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function KlingVideoControls({
  videoRatios, aspectRatio, setAspectRatio, duration, setDuration,
  sound, setSound, multiShot, setMultiShot, shotType, setShotType,
  multiPrompt, setMultiPrompt,
  seed, setSeed, maxDuration, minDuration, supportsMultiShot, supportsSeed,
  mode, soundRequired,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  for (let i = minDuration || 1; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      {videoRatios.length > 0 && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required={false} />
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required />
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setSound(!sound)}>
          <ParamLabel label="添加音效" required={!!soundRequired} style={{ marginBottom: 0 }} />
          <Switch value={sound} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
        </Pressable>
      </View>
      {supportsMultiShot && (
        <>
          <View style={styles.card}>
            <Pressable style={styles.switchRow} onPress={() => setMultiShot(!multiShot)}>
              <ParamLabel label="多镜头" required={false} style={{ marginBottom: 0 }} />
              <Switch value={multiShot} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
            </Pressable>
          </View>
          {multiShot && (
            <>
              <View style={styles.card}>
                <ParamLabel label="镜头类型" required={false} />
                <View style={styles.selectorRow}>
                  {['customize', 'intelligence'].map((t) => (
                    <Pressable key={t} style={({ pressed }) => [styles.selectorButton, shotType === t && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setShotType(t)}>
                      <Text style={[styles.selectorText, shotType === t && styles.selectorTextActive]}>{t === 'customize' ? '自定义' : '智能'}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.card}>
                <ParamLabel label="多镜头提示词" required={false} />
                <TextInput style={styles.dimInputFull} value={multiPrompt || ''} onChangeText={setMultiPrompt} multiline placeholder="JSON 格式的多镜头配置" placeholderTextColor={colors.textTertiary} />
              </View>
            </>
          )}
        </>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function KlingO34KControls({
  videoRatios, aspectRatio, setAspectRatio, duration, setDuration,
  sound, setSound, keepOriginalSound, setKeepOriginalSound,
  multiShot, setMultiShot, shotType, setShotType,
  multiPrompt, setMultiPrompt,
  maxDuration, minDuration, supportsMultiShot,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  for (let i = minDuration || 3; i <= (maxDuration || 15); i++) durArray.push(i);
  return (
    <>
      {videoRatios.length > 0 && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required={false} />
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required />
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setSound(!sound)}>
          <ParamLabel label="添加音效" required style={{ marginBottom: 0 }} />
          <Switch value={sound} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
        </Pressable>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setKeepOriginalSound(!keepOriginalSound)}>
          <ParamLabel label="保留原始声音" required style={{ marginBottom: 0 }} />
          <Switch value={keepOriginalSound} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
        </Pressable>
      </View>
      {supportsMultiShot && (
        <>
          <View style={styles.card}>
            <Pressable style={styles.switchRow} onPress={() => setMultiShot(!multiShot)}>
              <ParamLabel label="多镜头" required={false} style={{ marginBottom: 0 }} />
              <Switch value={multiShot} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
            </Pressable>
          </View>
          {multiShot && (
            <>
              <View style={styles.card}>
                <ParamLabel label="镜头类型" required={false} />
                <View style={styles.selectorRow}>
                  {['customize', 'intelligence'].map((t) => (
                    <Pressable key={t} style={({ pressed }) => [styles.selectorButton, shotType === t && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setShotType(t)}>
                      <Text style={[styles.selectorText, shotType === t && styles.selectorTextActive]}>{t === 'customize' ? '自定义' : '智能'}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.card}>
                <ParamLabel label="多镜头提示词" required={false} />
                <TextInput style={styles.dimInputFull} value={multiPrompt || ''} onChangeText={setMultiPrompt} multiline placeholder="JSON 格式的多镜头配置" placeholderTextColor={colors.textTertiary} />
              </View>
            </>
          )}
        </>
      )}
    </>
  );
}

export function ViduVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  audio, setAudio, isRec, setIsRec, offPeak, setOffPeak,
  maxDuration, minDuration, supportsAudio, supportsOffPeak, supportsIsRec, seed, setSeed, supportsSeed,
  movementAmplitude, setMovementAmplitude, supportsMovementAmplitude,
  style, setStyle, styleOptions,
  mode,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  for (let i = minDuration || 1; i <= (maxDuration || 16); i++) durArray.push(i);

  // 根据文档判断各参数必选/可选
  // base 版本有 style/movement_amplitude，official 版本有 off_peak/is_rec/seed
  const hasStyle = styleOptions && styleOptions.length > 0;
  const isBase = hasStyle || supportsMovementAmplitude;

  // resolution: 所有模式必选
  const isResolutionRequired = true;
  // style: base 版本所有模式必选
  const isStyleRequired = hasStyle;
  // aspect_ratio: 所有模式可选
  const isAspectRatioRequired = false;
  // duration: 所有模式必选
  const isDurationRequired = true;
  // audio: base t2v 可选, base i2v/flf 必选; official t2v 可选, official i2v/flf 必选
  const isAudioRequired = supportsAudio && mode !== 'text-to-video';
  // movement_amplitude: base i2v 可选, base flf 必选
  const isMovementAmplitudeRequired = supportsMovementAmplitude && mode === 'flf-to-video';
  // is_rec: 可选
  const isIsRecRequired = false;
  // off_peak: 可选
  const isOffPeakRequired = false;
  // seed: official flf 必选 (pro-official flf), 其余可选
  const isSeedRequired = supportsSeed && mode === 'flf-to-video' && !isBase;

  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required={isResolutionRequired} />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {hasStyle && (
        <View style={styles.card}>
          <ParamLabel label="风格" required={isStyleRequired} />
          <View style={styles.selectorRow}>
            {styleOptions.map((s) => (
              <Pressable key={s} style={({ pressed }) => [styles.selectorButton, style === s && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setStyle(s)}>
                <Text style={[styles.selectorText, style === s && styles.selectorTextActive]}>{s === 'general' ? '通用' : s === 'anime' ? '动漫' : s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="宽高比" required={isAspectRatioRequired} />
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required={isDurationRequired} />
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {supportsAudio && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setAudio(!audio)}>
            <ParamLabel label="生成音频" required={isAudioRequired} style={{ marginBottom: 0 }} />
            <Switch value={audio} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsIsRec && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setIsRec(!isRec)}>
            <ParamLabel label="推荐提示词" required={isIsRecRequired} style={{ marginBottom: 0 }} />
            <Switch value={isRec} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsOffPeak && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setOffPeak(!offPeak)}>
            <ParamLabel label="低谷模式" required={isOffPeakRequired} style={{ marginBottom: 0 }} />
            <Switch value={offPeak} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsMovementAmplitude && (
        <View style={styles.card}>
          <ParamLabel label="运动幅度" required={isMovementAmplitudeRequired} />
          <View style={styles.selectorRow}>
            {['auto', 'small', 'medium', 'large'].map((m) => (
              <Pressable key={m} style={({ pressed }) => [styles.selectorButton, movementAmplitude === m && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setMovementAmplitude(m)}>
                <Text style={[styles.selectorText, movementAmplitude === m && styles.selectorTextActive]}>{m === 'auto' ? '自动' : m === 'small' ? '小' : m === 'medium' ? '中' : '大'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={isSeedRequired} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function WanVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  promptExtend, setPromptExtend, watermark, setWatermark,
  negativePrompt, setNegativePrompt, seed, setSeed,
  supportsPromptExtend, supportsWatermark, supportsNegativePrompt,
  maxDuration, minDuration,
  audioSetting, setAudioSetting, drivingAudio, setDrivingAudio,
  audioUrl, setAudioUrl, referenceVoice, setReferenceVoice,
  supportsAudioSetting, supportsDrivingAudio, supportsAudioUrl,
  supportsRefImages, supportsRefVideos, supportsReferenceVoice,
  mode,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  const effectiveMinDuration = mode === 'video-edit' ? 0 : (minDuration || 2);
  const effectiveMaxDuration = mode === 'video-edit' ? 10 : (maxDuration || 15);
  for (let i = effectiveMinDuration; i <= effectiveMaxDuration; i++) durArray.push(i);
  const effectiveRatios = mode === 'video-edit' ? ['default', ...videoRatios] : videoRatios;
  // 根据模式判断参数必选/可选
  const isRatioRequired = mode === 'text-to-video';
  const isDurationRequired = mode !== 'video-edit';
  const isPromptExtendRequired = mode === 'text-to-video' || mode === 'image-to-video';
  const isWatermarkRequired = mode === 'text-to-video' || mode === 'image-to-video';
  const isAudioSettingRequired = mode === 'video-edit';
  return (
    <>
      {effectiveRatios.length > 0 && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required={isRatioRequired} />
          <View style={styles.selectorRow}>
            {effectiveRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r === 'default' ? '跟随视频' : r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required={isDurationRequired} />
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {supportsPromptExtend && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setPromptExtend(!promptExtend)}>
            <ParamLabel label="智能改写" required={isPromptExtendRequired} style={{ marginBottom: 0 }} />
            <Switch value={promptExtend} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setWatermark(!watermark)}>
            <ParamLabel label="水印" required={isWatermarkRequired} style={{ marginBottom: 0 }} />
            <Switch value={watermark} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsNegativePrompt && (
        <View style={styles.card}>
          <ParamLabel label="反向提示词" required={false} />
          <TextInput style={styles.dimInputFull} value={negativePrompt || ''} onChangeText={setNegativePrompt} placeholder="描述不想要的元素" placeholderTextColor={colors.textTertiary} multiline />
        </View>
      )}
      {supportsAudioSetting && mode === 'video-edit' && (
        <View style={styles.card}>
          <ParamLabel label="音频设置" required={isAudioSettingRequired} />
          <View style={styles.selectorRow}>
            {['auto', 'origin'].map((opt) => (
              <Pressable key={opt} style={({ pressed }) => [styles.selectorButton, audioSetting === opt && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAudioSetting(opt)}>
                <Text style={[styles.selectorText, audioSetting === opt && styles.selectorTextActive]}>{opt === 'auto' ? '自动' : '保留原声'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsDrivingAudio && (mode === 'image-to-video' || mode === 'video-extend') && (
        <View style={styles.card}>
          <ParamLabel label="驱动音频 URL" required={false} />
          <TextInput style={styles.dimInputFull} value={drivingAudio || ''} onChangeText={setDrivingAudio} placeholder="输入音频 URL" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsAudioUrl && mode === 'text-to-video' && (
        <View style={styles.card}>
          <ParamLabel label="音频 URL" required={false} />
          <TextInput style={styles.dimInputFull} value={audioUrl || ''} onChangeText={setAudioUrl} placeholder="输入音频 URL" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsReferenceVoice && mode === 'reference-to-video' && (
        <View style={styles.card}>
          <ParamLabel label="参考音频 URL" required={false} />
          <TextInput style={styles.dimInputFull} value={referenceVoice || ''} onChangeText={setReferenceVoice} placeholder="输入音频 URL" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="种子" required={false} />
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={colors.textTertiary} />
      </View>
    </>
  );
}

export function WanI2VControls({
  resolutions, resolution, setResolution,
  duration, setDuration, promptExtend, setPromptExtend,
  audio, setAudio, audioUrl, setAudioUrl,
  supportsPromptExtend, supportsAudio, supportsAudioUrl,
  maxDuration, minDuration,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  for (let i = minDuration || 5; i <= (maxDuration || 10); i++) durArray.push(i);
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required />
        <View style={styles.selectorRow}>
          {durArray.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {supportsPromptExtend && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setPromptExtend(!promptExtend)}>
            <ParamLabel label="智能改写" required style={{ marginBottom: 0 }} />
            <Switch value={promptExtend} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsAudio && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setAudio(!audio)}>
            <ParamLabel label="生成音频" required={false} style={{ marginBottom: 0 }} />
            <Switch value={audio} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsAudioUrl && (
        <View style={styles.card}>
          <ParamLabel label="音频 URL" required={false} />
          <TextInput style={styles.dimInputFull} value={audioUrl || ''} onChangeText={setAudioUrl} placeholder="输入音频 URL" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function HailuoVideoControls({
  resolutions, durationOptions, resolutionDurationMap, resolution, setResolution,
  duration, setDuration, promptOptimizer, setPromptOptimizer,
  fastPretreatment, setFastPretreatment, aigcWatermark, setAigcWatermark,
  supportsPromptOptimizer, supportsFastPretreatment, supportsWatermark,
}) {
  const { styles, colors } = useStyles();
  const allowedDurations = resolutionDurationMap
    ? (resolutionDurationMap[resolution] || durationOptions)
    : durationOptions;
  const validDuration = allowedDurations.includes(duration) ? duration : allowedDurations[0];
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => {
              setResolution(r);
              const newAllowed = resolutionDurationMap ? (resolutionDurationMap[r] || durationOptions) : durationOptions;
              if (!newAllowed.includes(duration)) setDuration(newAllowed[0]);
            }}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长 (秒)" required />
        <View style={styles.selectorRow}>
          {allowedDurations.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButton, validDuration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.selectorText, validDuration === d && styles.selectorTextActive]}>{d}s</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {supportsPromptOptimizer && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setPromptOptimizer(!promptOptimizer)}>
            <ParamLabel label="Prompt 优化" required={false} style={{ marginBottom: 0 }} />
            <Switch value={promptOptimizer} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsFastPretreatment && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setFastPretreatment(!fastPretreatment)}>
            <ParamLabel label="快速预处理" required={false} style={{ marginBottom: 0 }} />
            <Switch value={fastPretreatment} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setAigcWatermark(!aigcWatermark)}>
            <ParamLabel label="AI 水印" required={false} style={{ marginBottom: 0 }} />
            <Switch value={aigcWatermark} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
    </>
  );
}

export function HappyHorseVideoControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration,
  watermark, setWatermark, supportsWatermark,
  maxDuration, minDuration, seed, setSeed,
  audioSetting, setAudioSetting, supportsAudioSetting, mode,
}) {
  const { styles, colors } = useStyles();
  const durArray = [];
  for (let i = minDuration || 3; i <= (maxDuration || 15); i++) durArray.push(i);
  const isVideoEdit = mode === 'video-edit';
  return (
    <>
      {!isVideoEdit && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required={false} />
          <View style={styles.ratioGrid}>
            {videoRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.ratioButton, aspectRatio === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="分辨率" required={false} />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {!isVideoEdit && (
        <View style={styles.card}>
          <ParamLabel label="时长 (秒)" required={false} />
          <View style={styles.selectorRow}>
            {durArray.map((d) => (
              <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
                <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setWatermark(!watermark)}>
            <ParamLabel label="水印" required={false} style={{ marginBottom: 0 }} />
            <Switch value={watermark} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsAudioSetting && mode === 'video-edit' && (
        <View style={styles.card}>
          <ParamLabel label="音频设置" required={false} />
          <View style={styles.selectorRow}>
            {['auto', 'origin'].map((opt) => (
              <Pressable key={opt} style={({ pressed }) => [styles.selectorButton, audioSetting === opt && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAudioSetting(opt)}>
                <Text style={[styles.selectorText, audioSetting === opt && styles.selectorTextActive]}>{opt === 'auto' ? '自动' : '保留原声'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.card}>
        <ParamLabel label="种子" required={false} />
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="随机" placeholderTextColor={colors.textTertiary} />
      </View>
    </>
  );
}

export function LtxVideoControls({ display, setDisplay, displayOptions, seed, setSeed }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="显示方向" required={false} />
        <View style={styles.selectorRow}>
          {displayOptions.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.selectorButton, display === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDisplay(d)}>
              <Text style={[styles.selectorText, display === d && styles.selectorTextActive]}>{d === 'horizontal' ? '横屏' : '竖屏'}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="种子" required={false} />
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="1~2147483647，留空随机" placeholderTextColor={colors.textTertiary} />
      </View>
    </>
  );
}

export function BzaVideoXControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio, duration, setDuration, durationOptions,
  maxDuration, minDuration, mode,
}) {
  const { styles } = useStyles();
  const isVideoEdit = mode === 'video-edit';
  const durArray = durationOptions || (() => {
    const arr = [];
    for (let i = minDuration || 6; i <= (maxDuration || 10); i++) arr.push(i);
    return arr;
  })();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {!isVideoEdit && (
        <View style={styles.card}>
          <ParamLabel label="时长 (秒)" required />
          <View style={styles.selectorRow}>
            {durArray.map((d) => (
              <Pressable key={d} style={({ pressed }) => [styles.selectorButtonSmall, duration === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
                <Text style={[styles.selectorText, duration === d && styles.selectorTextActive]}>{d}s</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {!isVideoEdit && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required />
          <View style={styles.selectorRow}>
            {videoRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

export function BzaVideoV3Controls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio,
  duration, setDuration, durationOptions,
  generateAudio, setGenerateAudio,
  seed, setSeed,
  negativePrompt, setNegativePrompt,
  supportsAudio, supportsSeed, supportsNegativePrompt,
  mode,
}) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="宽高比" required />
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {durationOptions && (
        <View style={styles.card}>
          <ParamLabel label="时长" required />
          <View style={styles.ratioGrid}>
            {durationOptions.map((d) => (
              <Pressable key={d} style={({ pressed }) => [styles.ratioButton, String(duration) === String(d) && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
                <Text style={[styles.ratioText, String(duration) === String(d) && styles.ratioTextActive]}>{d}s</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsAudio && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setGenerateAudio(!generateAudio)}>
            <ParamLabel label="生成音频" required={false} style={{ marginBottom: 0 }} />
            <Switch value={generateAudio || false} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.textInput} value={seed ?? ''} onChangeText={(text) => setSeed(text.replace(/[^0-9]/g, ''))} placeholder="留空则随机" placeholderTextColor={colors.textTertiary} keyboardType="numeric" />
        </View>
      )}
      {supportsNegativePrompt && (
        <View style={styles.card}>
          <ParamLabel label="反向提示词" required={false} />
          <TextInput style={[styles.textInput, styles.textInputMultiline]} value={negativePrompt ?? ''} onChangeText={setNegativePrompt} placeholder="不希望出现的内容" placeholderTextColor={colors.textTertiary} multiline numberOfLines={2} />
        </View>
      )}
    </>
  );
}

export function BzaVideoGControls({
  resolutions, videoRatios, resolution, setResolution,
  aspectRatio, setAspectRatio,
  duration, setDuration, durationOptions,
  mode,
}) {
  const { styles } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required />
        <View style={styles.ratioGrid}>
          {resolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.ratioButton, resolution === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.ratioText, resolution === r && styles.ratioTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="宽高比" required={false} />
        <View style={styles.selectorRow}>
          {videoRatios.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.selectorButton, aspectRatio === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
              <Text style={[styles.selectorText, aspectRatio === r && styles.selectorTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="时长" required />
        <View style={styles.ratioGrid}>
          {durationOptions.map((d) => (
            <Pressable key={d} style={({ pressed }) => [styles.ratioButton, String(duration) === String(d) && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setDuration(d)}>
              <Text style={[styles.ratioText, String(duration) === String(d) && styles.ratioTextActive]}>{d}s</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

export function DreamActorControls() {
  const { styles } = useStyles();
  return (
    <View style={styles.card}>
      <ParamLabel label="上传人物图片和参考视频" required />
      <Text style={styles.priceHint}>参考视频（必选）+ 参考图片（必选），上传文件后即可生成</Text>
    </View>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  selectorButtonSmall: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  priceHint: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, marginTop: Spacing.sm },
  ratioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ratioButton: { width: '22%', paddingVertical: Spacing.sm + 1, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  ratioButtonActive: { backgroundColor: colors.primary },
  ratioText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  ratioTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  textInput: { backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: Typography.fontSize.footnote, color: colors.textPrimary },
  textInputMultiline: { minHeight: 60, textAlignVertical: 'top' },
});
