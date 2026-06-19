import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Description text shown below the illustration. */
  description?: ReactNode;
  /** Custom image source. Falls back to the built-in illustration. */
  image?: string;
  /** Width of the image, in pixels. */
  imageSize?: number;
  /** Extra content (actions, footer) rendered below the description. */
  children?: ReactNode;
}

/** Default inline illustration shown when no custom `image` is supplied. */
function DefaultImage() {
  return (
    <svg viewBox="0 0 79 86" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="ec-empty-a" x1="38.8%" x2="61.5%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <ellipse cx="39.5" cy="79" rx="39.5" ry="7" fill="url(#ec-empty-a)" />
        <g stroke="currentColor" strokeOpacity="0.4">
          <path
            fill="currentColor"
            fillOpacity="0.06"
            d="M18 13h42a4 4 0 0 1 4 4v45a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V17a4 4 0 0 1 4-4z"
          />
          <path strokeLinecap="round" d="M24 26h28M24 35h28M24 44h18" />
        </g>
      </g>
    </svg>
  );
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(props, ref) {
  const { description = 'No Data', image, imageSize, className, children, ...rest } = props;
  const ns = useNamespace('empty');

  return (
    <div ref={ref} className={cls(ns.b(), className)} {...rest}>
      <div className={ns.e('image')} style={imageSize ? { width: imageSize } : undefined}>
        {image ? <img src={image} alt="" /> : <DefaultImage />}
      </div>
      {description !== undefined && description !== null && description !== '' && (
        <div className={ns.e('description')}>{description}</div>
      )}
      {children !== undefined && children !== null && (
        <div className={ns.e('bottom')}>{children}</div>
      )}
    </div>
  );
});
