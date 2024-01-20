import { useState } from 'react';
import styled from 'styled-components';
import { ActionPlanItem } from '../dtos/actionPlan.dto';
import { ChatMessage } from '../dtos/chat.dto';

export interface ChatMessageItemProps {
  information: ChatMessage;
  onPositive?: (caption: string, message: string, actionItem?: ActionPlanItem) => void;
  onPositiveCaption?: string;
  onNegative?: (caption: string, message: string, actionItem?: ActionPlanItem) => void;
  onNegativeCaption?: string;
  isLatestBotMessage?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = (props: ChatMessageItemProps) => {
  const length = 8;
  const contentClassName = `grid cs${props.information.isBotMessage ? 1 : 3} ce${props.information.isBotMessage ? 1 + length : 3 + length}`;

  const actionItem = props.information.actionItem;

  const type = actionItem?.type;
  const positiveCaption = actionItem?.positiveCaption ?? 'Yes';
  const negativeCaption = actionItem?.negativeCaption ?? 'No';

  const [additionalFeedback, setAdditionalFeedback] = useState<string>('');

  return (
    <Container className={contentClassName} isBot={props.information.isBotMessage}>
      <div className='grid cs1 ce12'>
        <div className='cs1 ce12' dangerouslySetInnerHTML={{ __html: props.information.message.replaceAll('\n', '<br>') }}></div>
        {type === 'confirmation' && (
          <ButtonContainer className='cs1 ce12 grid'>
            <div className='cs1 ce6'>
              <Button
                className='w100 button button-primary button-small'
                onClick={() =>
                  props.onPositive?.(`${positiveCaption}. ${additionalFeedback}`, props.information.message, props.information.actionItem)
                }
                disabled={!props.isLatestBotMessage}>
                {positiveCaption}
              </Button>
            </div>
            <div className='cs7 ce12'>
              <Button
                className='w100 button button-secondary button-small'
                onClick={() =>
                  props.onNegative?.(`${negativeCaption}. ${additionalFeedback}`, props.information.message, props.information.actionItem)
                }
                disabled={!props.isLatestBotMessage}>
                {negativeCaption}
              </Button>
            </div>
            {props.isLatestBotMessage && (
              <div className='cs1 ce12 grid'>
                <div className='cs1 ce12 p-small'>Additional feedback</div>
                <div className='cs1 ce12 form-group form-group-small'>
                  <input
                    className='input input-small'
                    value={additionalFeedback}
                    onChange={e => setAdditionalFeedback(e.target.value)}
                    placeholder='Make it shorter...'
                  />
                </div>
              </div>
            )}
          </ButtonContainer>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div<{ isBot: boolean }>`
  background-color: ${props => props.theme.colors.panel};
  border-radius: 16px;
  padding: 16px;
  outline-style: solid;
  outline-width: ${props => (props.isBot ? 0 : 1)}px;
  outline-color: green;
  margin-bottom: 1px;
  margin-top: 1px;
`;

const ButtonContainer = styled.div`
  margin-top: 8px;
`;

const Button = styled.button`
  justify-content: center;
`;
