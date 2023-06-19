export interface AppConfiguration {
  ui: {
    button: {
      base: string,
      font: string,
      rounded: 'rounded-md',
      size: {
        [key: string]: string;
      }
      gap: {
        [key: string]: string;
      }
      padding: {
        [key: string]: string;
      },
      square: {
        [key: string]: string;
      }
      color: {
        [key: string]: {
          solid: string,
          ghost: string,
        }
      },
      variant: {
        solid: string,
        outline: string,
        soft: string,
        ghost: string,
        link: string,
      },
      icon: {
        base: string,
        size: {
          [key: string]: string;
        },
      },
      default: {
        size: string,
        variant: string,
        color: string,
        loadingIcon: string,
      },
    }
  }
}

