import type { ComponentType } from 'react';

import ButtonDemo from './button';
import IconDemo from './icon';
import LayoutDemo from './layout';
import ContainerDemo from './container';
import LinkDemo from './link';
import TextDemo from './text';
import SpaceDemo from './space';
import DividerDemo from './divider';
import ConfigProviderDemo from './config-provider';
import InputDemo from './input';
import InputNumberDemo from './input-number';
import SelectDemo from './select';
import CheckboxDemo from './checkbox';
import RadioDemo from './radio';
import SwitchDemo from './switch';
import FormDemo from './form';
import CardDemo from './card';
import TagDemo from './tag';
import AvatarDemo from './avatar';
import TableDemo from './table';
import PaginationDemo from './pagination';
import TabsDemo from './tabs';
import MenuDemo from './menu';
import DropdownDemo from './dropdown';
import DialogDemo from './dialog';

/** Maps a catalog component `key` to its live demo component. */
export const demos: Record<string, ComponentType> = {
  button: ButtonDemo,
  icon: IconDemo,
  layout: LayoutDemo,
  container: ContainerDemo,
  link: LinkDemo,
  text: TextDemo,
  space: SpaceDemo,
  divider: DividerDemo,
  'config-provider': ConfigProviderDemo,
  input: InputDemo,
  'input-number': InputNumberDemo,
  select: SelectDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  switch: SwitchDemo,
  form: FormDemo,
  card: CardDemo,
  tag: TagDemo,
  avatar: AvatarDemo,
  table: TableDemo,
  pagination: PaginationDemo,
  tabs: TabsDemo,
  menu: MenuDemo,
  dropdown: DropdownDemo,
  dialog: DialogDemo,
};

export default demos;
