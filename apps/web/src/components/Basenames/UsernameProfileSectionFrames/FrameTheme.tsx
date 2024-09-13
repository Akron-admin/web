/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
import type { FrameUIComponents, FrameUITheme } from '@frames.js/render/ui';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BaseLoading from './base-loading.gif';

type StylingProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const theme: FrameUITheme<StylingProps> = {
  Error: {
    className:
      'flex flex-col rounded-lg overflow-hidden bg-transparent relative items-center justify-center opacity-50',
  },
  Root: {
    className:
      'flex flex-col rounded-lg items-center justify-center overflow-hidden bg-transparent relative border border-palette-line/20 min-h-[245px] min-w-[346px]',
  },
  ButtonsContainer: {
    className:
      'flex-1 w-full text-xs sm:text-sm flex sm:py-3 py-2 sm:px-7 px-2 justify-around bg-palette-positiveForeground gap-2 sm:gap-4',
  },
  Button: {
    className:
      'grow py-3 px-8 rounded-full bg-[#F3F3F3] text-palette-secondaryForeground font-medium transition-colors hover:bg-state-b-hovered max-h-[44px]',
  },
  ImageContainer: {
    className: 'flex border-0 overflow-hidden',
  },
  TextInputContainer: {
    className:
      'bg-palette-positiveForeground flex flex-row items-center justify-around gap-2 w-full',
  },
  TextInput: {
    className: 'rounded-xl border border-palette-line/20 px-3 py-2 mt-3 mx-3 w-full',
  },
};

type TransitionWrapperProps = {
  aspectRatio: '1:1' | '1.91:1';
  src: string;
  alt: string;
  onImageLoadEnd: () => void;
  stylingProps: StylingProps;
  status: 'frame-loading' | 'frame-loading-complete';
};

function TransitionWrapper({
  aspectRatio,
  src,
  alt,
  onImageLoadEnd,
  stylingProps,
  status,
}: TransitionWrapperProps) {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isLoading = status === 'frame-loading';
  useEffect(() => {
    let timeout: number;
    if (!isLoading) {
      timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500) as unknown as number;
    } else {
      setIsTransitioning(true);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  const ar = aspectRatio.replace(':', '/');

  return (
    <div className="relative">
      {/* Loading Screen */}
      <div
        className={classNames(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-500',
          { 'opacity-0': !isLoading || !isTransitioning, 'opacity-100': isLoading },
        )}
      >
        <Image src={BaseLoading} alt="" width={22} height={22} />
      </div>

      {/* Image */}
      <img
        {...stylingProps}
        src={isLoading ? undefined : src}
        alt={alt}
        onLoad={onImageLoadEnd}
        onError={onImageLoadEnd}
        data-aspect-ratio={ar}
        style={{
          '--frame-image-aspect-ratio': ar,
          ...(isCssProperties(stylingProps.style) && stylingProps.style),
        }}
        className={classNames('transition-opacity duration-500', {
          'opacity-0': isLoading || isTransitioning,
          'opacity-100': !isLoading && !isTransitioning,
        })}
      />
    </div>
  );
}

export const components: FrameUIComponents<StylingProps> = {
  LoadingScreen: (props) => {
    return (
      <Image
        src={BaseLoading}
        alt=""
        width={22}
        height={22}
        className={classNames({
          hidden: props.frameState.status !== 'loading',
        })}
      />
    );
  },
  Image(props, stylingProps) {
    // @ts-expect-error frames.js doesn't export this type so ours is a little off
    return <TransitionWrapper {...props} stylingProps={stylingProps} />;
  },
};

function isCssProperties(value: unknown): value is React.CSSProperties {
  return typeof value === 'object' && value !== null;
}