import React from "react";
import {AntDesign, SimpleLineIcons, FontAwesome5} from "@expo/vector-icons";

type IconProps = React.ComponentProps<typeof AntDesign> | React.ComponentProps<typeof SimpleLineIcons>

/**
 * specify icon set in Icon declaration to use a set other than the default
 */

export enum IconSets {
    AntDesign,
    SimpleLineIcons,
    FontAwesome5,
}

export const Icon = ({set = IconSets.SimpleLineIcons, ...initialProps}: IconProps & {set?: IconSets}) => {
    const props = {
        color: "white",
        ...initialProps,
    };
  switch (set) {
      case IconSets.AntDesign:
          return <AntDesign {...props}/>;
      case IconSets.SimpleLineIcons:
          return <SimpleLineIcons {...props}/>;
      case  IconSets.FontAwesome5:
          return <FontAwesome5 {...props}/>;
      default:
          return null;
  }
};
