import styled from 'styled-components';

export interface SimpleModalItemProps {
  title: string;
  onClick: () => void;
  isDangerous?: boolean;
  hasBottomBorder?: boolean;
}

export const SimpleModalItem: React.FC<SimpleModalItemProps> = (props: SimpleModalItemProps) => {
  return (
    <Container onClick={() => props.onClick()} isDangerous={props.isDangerous} hasBorderBottom={props.hasBottomBorder}>
      {props.title}
    </Container>
  );
};

const Container = styled.div<{ isDangerous?: boolean; hasBorderBottom?: boolean }>`
  width: 100%;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${props => (props.isDangerous ? props.theme.colors.danger : props.theme.colors.black)};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: ${props => (props.hasBorderBottom ? `1px solid ${props.theme.colors.panel}` : 'none')};

  &:hover {
    background-color: ${props => props.theme.colors.primary[100]};
    cursor: pointer;
  }
`;
