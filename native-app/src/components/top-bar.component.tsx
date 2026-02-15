import { StyleSheet, View } from "react-native";
import { padding, paddingSmall, spacing } from "../core/styles/global";
import { BackChevron } from "./back-chevron.component";
import { SettingsButton } from "./settings-button.component";
import { Container } from "./container.component";

interface TabBarComponentProps {
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const TobBar = ({
  showBackButton = true,
  children,
}: TabBarComponentProps) => {
  const buttonSize = 24;

  const renderPlaceholder = () => {
    return <View style={{ width: buttonSize, height: buttonSize }}></View>;
  };

  return (
    <Container column w100 padding={padding} style={{ height: 60 }}>
      <Container row centerVertical spaceBetween w100 h100>
        {showBackButton ? (
          <BackChevron size={buttonSize} />
        ) : (
          renderPlaceholder()
        )}
        {children ? children : renderPlaceholder()}
      </Container>
    </Container>
  );
};
