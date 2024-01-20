import 'styled-components';
import { Theme } from './theme/interfaces';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
