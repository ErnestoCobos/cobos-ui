import { Menu, MenuItem, SubMenu, MenuItemGroup } from '@cobos/react';
import { Example, DemoStack } from './_demo';
import { UserGlyph, StarGlyph, EditGlyph } from '../icons';

export default function MenuDemo() {
  return (
    <DemoStack>
      <Example title="Horizontal" description="Top-bar navigation with a submenu.">
        <Menu mode="horizontal" defaultActive="1">
          <MenuItem index="1" icon={StarGlyph}>
            Home
          </MenuItem>
          <MenuItem index="2">Catalog</MenuItem>
          <SubMenu index="3" title="Resources">
            <MenuItem index="3-1">Docs</MenuItem>
            <MenuItem index="3-2">Tokens</MenuItem>
            <MenuItem index="3-3">Changelog</MenuItem>
          </SubMenu>
          <MenuItem index="4" disabled>
            Pricing
          </MenuItem>
        </Menu>
      </Example>

      <Example title="Vertical with groups and submenus">
        <div style={{ maxWidth: 240 }}>
          <Menu defaultActive="2-1" defaultOpeneds={['2']}>
            <MenuItemGroup title="Workspace">
              <MenuItem index="1" icon={UserGlyph}>
                Team
              </MenuItem>
            </MenuItemGroup>
            <SubMenu index="2" title="Projects" icon={EditGlyph}>
              <MenuItem index="2-1">Atlas</MenuItem>
              <MenuItem index="2-2">Beacon</MenuItem>
              <MenuItem index="2-3">Comet</MenuItem>
            </SubMenu>
            <MenuItem index="3" icon={StarGlyph}>
              Starred
            </MenuItem>
          </Menu>
        </div>
      </Example>
    </DemoStack>
  );
}
