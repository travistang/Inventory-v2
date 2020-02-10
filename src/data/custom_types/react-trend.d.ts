/**
 * Some declarations for external modules
 */
declare module 'react-trend' {
    interface Props {
        autoDraw?: boolean;
        autoDrawDuration?: number;
        autoDrawEasing?: string;
        data: number[] | Array<{ value: number }>;
        gradient?: string[];
        height?: number | string;
        width?: number | string;
        padding?: number;
        radius?: number;
        smooth?: boolean;
        stroke?: string;
        strokeDasharray?: number[];
        strokeDashoffset?: number;
        strokeLinecap?: 'butt' | 'square' | 'round';
        strokeLinejoin?: string;
        strokeOpacity?: number;
        strokeWidth?: number;
    }
    export default class Trend extends React.Component<Props> {}
}