import {JSX} from 'solid-js';
import * as styles from './Link.css';
import clsx from 'clsx';
import {omitProps} from 'solid-use';
import {Text, TextProps} from '../Text/Text';

interface LinkProps extends TextProps<'a'> {
  underline?: boolean;
}

export function Link(props: LinkProps): JSX.Element {
  return (
    <Text
      as={'a'}
      {...omitProps(props, ['underline'])}
      class={clsx(
        props.class,
        styles.link({
          underline: props.underline,
        }),
      )}
    >
      {props.children}
    </Text>
  );
}
