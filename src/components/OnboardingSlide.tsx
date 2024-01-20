import styled from 'styled-components';

export interface OnboardingSlideProps {
  title: string;
  description1: string;
  description2: string;
  illustrationUrl: string;
  onNext: () => void;
  onPrevious: () => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = (props: OnboardingSlideProps) => {
  return (
    <Container className='grid cs1 ce12'>
      <Title className='cs4 ce7 h3'>{props.title}</Title>
      <Description className='cs1 ce12'>{props.description1}</Description>
      <div className='cs1 ce12 grid'>
        <Button
          className='button-icon button-icon-small icon-arrow-left cs1 ce2'
          onClick={props.onPrevious}
          disabled={!props.canScrollLeft}></Button>
        <Image className='cs4 ce9' src={props.illustrationUrl}></Image>
        <Button
          className='button-icon button-icon-small icon-arrow-right cs11 ce12'
          onClick={props.onNext}
          disabled={!props.canScrollRight}></Button>
      </div>
      <Description className=''>{props.description2}</Description>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.panel};
  border-radius: 8px;
  padding: 24px 16px;
`;

const Image = styled.img`
  height: 300px;
  display: flex;
  flex-direction: row;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.panel};
`;

const Title = styled.div`
  text-align: center;
  font-weight: 600;
  height: 65px;
`;

const Description = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  height: 70px;
`;
