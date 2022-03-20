import {PanelHeader} from './PanelHeader';
import {PanelRow, TwoColumnPanelRow} from './PanelRow';
import {Select} from '../ui/Select/Select';
import {SegmentedField} from '../ui/SegmentedField/SegmentedField';
import {Text} from '../ui/Text/Text';
import {useI18n} from '@codeimage/locale';
import {locale} from './FrameSidebar.locale';
import {
  editor$,
  font$,
  setFontId,
  setFontWeight,
  setLanguageId,
  setShowLineNumbers,
} from '@codeimage/store/editor';
import {appEnvironment} from '../../core/configuration';
import {useModality} from '../../core/hooks/isMobile';
import {fromObservableObject} from '../../core/hooks/from-observable-object';
import {from} from 'solid-js';
import {map} from 'rxjs';

export const EditorStyleForm = () => {
  const {languages, fonts} = appEnvironment;
  const editor = fromObservableObject(editor$);
  const modality = useModality();
  const [t, {merge}] = useI18n<typeof locale>();
  merge(locale);

  const font = from(font$);

  const fontWeightOptions = from(
    font$.pipe(
      map(font => font?.types || []),
      map(types =>
        types.map(type => ({
          label: type.name,
          value: type.weight,
        })),
      ),
    ),
  );

  return (
    <>
      <PanelHeader label={t('frame.editor')} />

      <PanelRow label={t('frame.language')}>
        <TwoColumnPanelRow>
          <Select
            multiple={false}
            native={modality === 'mobile'}
            items={languages.map(({label, id}) => ({
              label: label,
              value: id,
            }))}
            value={editor.languageId}
            onSelectChange={value => setLanguageId(value ?? languages[0].id)}
          />
        </TwoColumnPanelRow>
      </PanelRow>

      <PanelRow label={t('frame.lineNumbers')}>
        <TwoColumnPanelRow>
          <SegmentedField
            size={'xs'}
            value={editor.showLineNumbers}
            onChange={setShowLineNumbers}
            items={[
              {label: 'Show', value: true},
              {label: 'Hide', value: false},
            ]}
          />
        </TwoColumnPanelRow>
      </PanelRow>

      <PanelRow label={t('frame.font')}>
        <TwoColumnPanelRow>
          <Select
            native={modality === 'mobile'}
            multiple={false}
            items={fonts.map(font => ({
              label: font.name,
              value: font,
            }))}
            value={fonts.find(font => font.id === editor.fontId)}
            itemContent={({label, value, selected}) => (
              <Text
                size={'xs'}
                display={'block'}
                weight={selected ? 'medium' : 'normal'}
                style={{'font-family': `${value.name}, monospace`}}
              >
                {label}
              </Text>
            )}
            onSelectChange={value => setFontId(value?.id ?? fonts[0].id)}
          />
        </TwoColumnPanelRow>
      </PanelRow>

      <PanelRow label={t('frame.fontWeight')}>
        <TwoColumnPanelRow>
          <Select
            native={modality === 'mobile'}
            multiple={false}
            items={fontWeightOptions()}
            value={editor.fontWeight}
            onSelectChange={value =>
              setFontWeight(value ?? font()?.types[0].weight ?? 400)
            }
          />
        </TwoColumnPanelRow>
      </PanelRow>
    </>
  );
};
