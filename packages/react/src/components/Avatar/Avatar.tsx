import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type AvatarSize = 'large' | 'default' | 'small' | number;

export type AvatarShape = 'circle' | 'square';

export type AvatarFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size token or explicit pixel size. */
  size?: AvatarSize;
  /** Shape of the avatar. */
  shape?: AvatarShape;
  /** Image source. */
  src?: string;
  /** Image `srcset`. */
  srcSet?: string;
  /** Image alternative text. */
  alt?: string;
  /** How the image fits its box. */
  fit?: AvatarFit;
  /** Fallback icon when no image is available. */
  icon?: ReactNode;
  /** Fired when the image fails to load. Return `false` to keep showing it. */
  onError?: (e: SyntheticEvent<HTMLImageElement>) => boolean | void;
  children?: ReactNode;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  const {
    size = 'default',
    shape = 'circle',
    src,
    srcSet,
    alt,
    fit = 'cover',
    icon,
    onError,
    className,
    style,
    children,
    ...rest
  } = props;

  const ns = useNamespace('avatar');
  const [hasLoadError, setHasLoadError] = useState(false);

  // Reset the error state whenever the source changes.
  useEffect(() => {
    setHasLoadError(false);
  }, [src, srcSet]);

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    const keep = onError?.(e);
    if (keep !== false) {
      setHasLoadError(true);
    }
  };

  const isImageSize = typeof size === 'number';

  const classes = cls(
    ns.b(),
    ns.m(shape),
    !isImageSize && size !== 'default' && ns.m(size),
    Boolean(icon) && ns.m('icon'),
    className,
  );

  const sizeStyle: CSSProperties = isImageSize
    ? { width: `${size}px`, height: `${size}px`, fontSize: `${size / 2}px` }
    : {};

  const showImage = Boolean(src || srcSet) && !hasLoadError;

  return (
    <span ref={ref} className={classes} style={{ ...sizeStyle, ...style }} {...rest}>
      {showImage ? (
        <img
          className={ns.e('image')}
          src={src}
          srcSet={srcSet}
          alt={alt}
          style={{ objectFit: fit }}
          onError={handleError}
        />
      ) : icon ? (
        <span className={ns.e('icon')}>{icon}</span>
      ) : (
        children
      )}
    </span>
  );
});
