import styled from 'styled-components';
import { ChatMessage } from '../dtos/chat.dto';

export interface ChatMessageItemProps {
  information: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = (props: ChatMessageItemProps) => {
  const length = 8;
  const contentClassName = `grid cs${props.information.isBotMessage ? 1 : 3} ce${props.information.isBotMessage ? 1 + length : 3 + length}`;

  return (
    <Container className={contentClassName} isBot={props.information.isBotMessage}>
      <div className='grid cs1 ce12'>
        <div className='cs1 ce12'>{props.information.message}</div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ isBot: boolean }>`
  background-color: ${props => props.theme.colors.panel};
  border-radius: 16px;
  padding: 8px 16px;
  outline-style: solid;
  outline-width: ${props => (props.isBot ? 0 : 1)}px;
  outline-color: green;
  margin-bottom: 1px;
  margin-top: 1px;
`;
