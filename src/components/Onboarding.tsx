import { useState } from 'react';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import { LocalStorageStore } from '../store';
import { OnboardingSlide } from './OnboardingSlide';

export interface OnboardingProps {
  onComplete: () => void;
}

interface OnboardingInformation {
  title: string;
  description1: string;
  description2: string;
  illustrationUrl: string;
  hasButton?: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = (props: OnboardingProps) => {
  const completeOnboarding = () => {
    console.log('completeOnboarding');

    LocalStorageStore.getInstance().set('hasSeenOnboarding', true);
    props.onComplete();
  };

  const onboardingInformation: OnboardingInformation[] = [
    {
      title: 'Facilitating a workshop and no idea where to start?',
      description1: 'Look no further - you found your workshop buddy!',
      description2: "We've got this easy and fast, together! find out how, in the next slides",
      illustrationUrl: '../assets/images/onboarding01.svg',
    },
    {
      title: 'I’ll guide you through the process!',
      description1: 'In an easy chat among friends',
      description2: 'We find out exactly what you need and customize along the way',
      illustrationUrl: '../assets/images/onboarding02.svg',
    },
    {
      title: 'Your agenda and all boards?',
      description1: 'don’t worry, I’ll do them for you!',
      description2: 'You can  customize the color theme to match you companies CI later',
      illustrationUrl: '../assets/images/onboarding03.svg',
    },
    {
      title: 'Buddy’s don’t let each other down! ',
      description1: 'I got you covered with tips, best pracises and helpful videos',
      description2: 'Start now and become the next workshop wizard',
      illustrationUrl: '../assets/images/onboarding04.svg',
      hasButton: true,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <Container>
      <OnboardingSlide
        title={onboardingInformation[currentIndex].title}
        description1={onboardingInformation[currentIndex].description1}
        description2={onboardingInformation[currentIndex].description2}
        illustrationUrl={onboardingInformation[currentIndex].illustrationUrl}
        canScrollLeft={currentIndex > 0}
        canScrollRight={currentIndex < onboardingInformation.length - 1}
        onNext={() => setCurrentIndex(currentIndex + 1)}
        onPrevious={() => setCurrentIndex(currentIndex - 1)}
        hasButton={onboardingInformation[currentIndex].hasButton}
        onButtonClicked={completeOnboarding}
      />
      <IndicatorRow>
        {onboardingInformation.map((_, index) => {
          return <Indicator isActive={index === currentIndex} onClick={() => setCurrentIndex(index)}></Indicator>;
        })}
      </IndicatorRow>
      {onboardingInformation[currentIndex].hasButton && (
        <Button className='button button-primary' onClick={() => completeOnboarding()}>
          Start now
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  align-items: center;
`;

const IndicatorRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
  flex: 1;
  margin-bottom: 32px;
`;

const Indicator = styled.div<{ isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  background-color: ${props => (props.isActive ? props.theme.colors.primary[500] : props.theme.colors.primary[100])};

  &:hover {
    cursor: pointer;
  }
`;

const Button = styled.button`
  margin-top: 32px;
`;
