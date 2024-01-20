import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { version } from '../../package.json';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='grid w100'>
      <div className='cs1 ce4'>
        <button className='button-icon button-icon-small icon-settings' type='button' onClick={() => navigate('/settings')}></button>
        <button className='button-icon button-icon-small icon-card-list' type='button' onClick={() => navigate('/debug')}></button>
      </div>
      <VersionText className='cs8 ce12'>Version {version}</VersionText>
    </div>
  );
};

const VersionText = styled.div`
  text-align: right;
`;
