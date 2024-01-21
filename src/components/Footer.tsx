import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { version } from '../../package.json';

export interface FooterProps {
  onSettingsClick: () => void;
}

export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  const navigate = useNavigate();

  return (
    <FooterContainer className='grid w100'>
      <VersionText className='cs1 ce4 p-small'>Version {version}</VersionText>
      <Container className='cs8 ce12'>
        <button className='button-icon button-icon-small icon-settings' type='button' onClick={() => props.onSettingsClick()}></button>
        <button className='button-icon button-icon-small icon-comment-feedback' type='button' onClick={() => navigate('/debug')}></button>
      </Container>
    </FooterContainer>
  );
};

const VersionText = styled.div`
  text-align: left;
  color: ${props => props.theme.colors.secondary[500]};
`;

const Container = styled.div`
  text-align: right;
`;

const FooterContainer = styled.div`
  height: 44px;
`;
