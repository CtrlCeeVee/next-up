import { Svg, Path } from "react-native-svg";
import { useTheme } from "../core/theme";

export const SelectedIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color?: string;
}) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.primary;

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size}>
      <Path
        d="M24.267662,0C24.267662,13.40266,13.40266,24.267662,0,24.267662s-24.267662-10.865002-24.267662-24.267662s10.865002-24.267662,24.267662-24.267662s24.267662,10.865002,24.267662,24.267662Z"
        transform="matrix(2.060355 0 0 2.060355 50 50)"
        fill={iconColor}
      />
      <Path
        d="M5.463502,52.292139c-10.78946-16.818868,71.853196-16.818864,60.489828.000001s5.913503,16.818865,5.913503,16.818865h-72.214729c0,0,16.600858.000002,5.811398-16.818866Z"
        transform="matrix(1.384759 0 0 1.384759 0.481754 4.297913)"
        fill={iconColor}
      />
    </Svg>
  );
};
