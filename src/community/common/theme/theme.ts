import { createTheme } from "@mui/material/styles";
import * as React from "react";

declare module "@mui/material/styles" {
  interface Palette {
    notifyBadge: {
      main: string;
      contrastText: string;
    };
    greens: {
      main: string;
      lighter: string;
      light: string;
      lightSecondary: string;
      dark: string;
      midDark: string;
      darker: string;
      deep_shadows: string;
      darkBoarder: string;
      lightBackground: string;
      lightTertiary: string;
    };
    amber: {
      lightSecondary: string;
      mid: string;
      dark: string;
      main: string;
      light: string;
      chipText: string;
      chipDark: string;
      text: string;
    };
    trendChart: {
      available: string;
      away: string;
      workHours: string;
      tooltip: {
        background: string;
        color: string;
      };
    };
    purples: {
      light: string;
      main: string;
      dark: string;
      brand: string;
    };
    typeBreakDownChart: {
      annual: string;
      casual: string;
      medical: string;
      academic: string;
      maternity: string;
      other: string;
    };
    teamTimeUtilizationChart: {
      line: string;
      bar: string;
    };
    lateArrivalsChart: {
      line: string;
      area: string;
    };
    customGrey: {
      customGreyWithAlpha: string;
    };
    graphColors: {
      green: string;
      yellow: string;
      pink: string;
      blue: string;
    };
  }
  interface PaletteOptions {
    notifyBadge: {
      main: string;
      contrastText: string;
    };
    greens: {
      main: string;
      lighter: string;
      light: string;
      lightSecondary: string;
      dark: string;
      midDark: string;
      darker: string;
      deep_shadows: string;
      darkBoarder: string;
      lightBackground: string;
      lightTertiary: string;
    };
    amber: {
      lightSecondary: string;
      mid: string;
      dark: string;
      main: string;
      light: string;
      chipText: string;
      chipDark: string;
      text: string;
    };
    trendChart: {
      available: string;
      away: string;
      workHours: string;
      tooltip: {
        background: string;
        color: string;
      };
    };
    purples: {
      light: string;
      main: string;
      dark: string;
      brand: string;
    };
    typeBreakDownChart: {
      annual: string;
      casual: string;
      medical: string;
      academic: string;
      maternity: string;
      other: string;
    };
    teamTimeUtilizationChart: {
      line: string;
      bar: string;
    };
    lateArrivalsChart: {
      line: string;
      area: string;
    };
    customGrey: {
      customGreyWithAlpha: string;
    };
    graphColors: {
      green: string;
      yellow: string;
      pink: string;
      blue: string;
    };
  }
  interface TypographyVariants {
    onboardingHeader: React.CSSProperties;
    tableHeader: React.CSSProperties;
    label: React.CSSProperties;
    placeholder: React.CSSProperties;
    smallTitle: React.CSSProperties;
    allVariants: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    onboardingHeader?: React.CSSProperties;
    tableHeader?: React.CSSProperties;
    label?: React.CSSProperties;
    placeholder?: React.CSSProperties;
    smallTitle?: React.CSSProperties;
    allVariants: React.CSSProperties;
  }
}
declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    notifyBadge: true;
  }
}
declare module "@mui/material/styles/createPalette" {
  interface TypeText {
    error?: string;
    errorLight?: string;
    other?: string;
    darkText?: string;
    darkerRedText?: string;
    darkerText?: string;
    textLighter: string;
    textDarkGrey: string;
    textGrey: string;
    whiteText?: string;
    blackText?: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    onboardingHeader: true;
    tableHeader: true;
    smallTitle: true;
    label: true;
    placeholder: true;
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: false;
    subtitle1: false;
    subtitle2: false;
    body1: true;
    body2: true;
    button: false;
    caption: true;
    overline: false;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#93C5FD", //* primary-color
      dark: "#2A61A0" //* primary-color-text
    },
    secondary: {
      main: "#DBEAFE", //* primary-color-background
      dark: "#408CE4" //* primary-color-accent
    },
    grey: {
      50: "#FAFAFA",
      100: "#F4F4F5",
      200: "#E4E4E7",
      300: "#E8E8E8",
      400: "#3F3F46",
      500: "#D4D4D8",
      600: "#8080804f",
      700: "#71717A",
      800: "#868686",
      900: "#39393D",
      A100: "#A1A1AA",
      A200: "#EEEEEE",
      A400: "#D8D8D8",
      A700: "#E9E9EA"
    },
    error: {
      main: "#FEE2E2",
      dark: "#FCA5A5",
      light: "#FEF2F2",
      contrastText: "#DC2626"
    },
    text: {
      secondary: "#52525B",
      error: "#7F1D1D",
      errorLight: "#92400E",
      darkText: "#A4A4A4",
      darkerText: "#B91C1C",
      darkerRedText: "#991B1B",
      textLighter: "#0000000f",
      textDarkGrey: "#27272A",
      textGrey: "#64748B",
      whiteText: "#ffffff",
      blackText: "#000000"
    },
    notifyBadge: {
      main: "#EF4444",
      contrastText: "#ffffff"
    },
    greens: {
      main: "#2ECA45",
      lighter: "#ECFCCB",
      light: "#D9F99D",
      lightSecondary: "#62B774",
      midDark: "#16A34A",
      dark: "#65A30D",
      darker: "#166534",
      deep_shadows: "#3F6212",
      darkBoarder: "#4D7C0F",
      lightBackground: "#DCFCE7",
      lightTertiary: "#F7FEE7"
    },
    amber: {
      lightSecondary: "#FDE68A",
      mid: "#FEF3C7",
      dark: "#B45309",
      light: "#FFFBEB",
      main: "#EEA92E",
      chipText: "#78350F",
      chipDark: "#FCD34D",
      text: "#92400E"
    },
    trendChart: {
      available: "#15803D",
      away: "#DC2626",
      workHours: "#DB2777",
      tooltip: {
        background: "#F4F4F5",
        color: "#000000"
      }
    },
    purples: {
      light: "#ECDAFF",
      main: "#D8B4FE",
      dark: "#9333EA",
      brand: "#7750EC"
    },
    typeBreakDownChart: {
      annual: "#EC4899",
      casual: "#6366F1",
      medical: "#A855F7",
      academic: "#F59E0B",
      maternity: "#10B981",
      other: "#F87171"
    },
    teamTimeUtilizationChart: {
      line: "#4CC0C0",
      bar: "#4CC0C0"
    },
    lateArrivalsChart: {
      line: "#F94144",
      area: "#f9787b75"
    },
    customGrey: {
      customGreyWithAlpha: "rgba(0,0,0,0.01)"
    },
    graphColors: {
      green: "#4CC0C0",
      yellow: "#FFCD56",
      pink: "#FF6384",
      blue: "#7BB9FF"
    }
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    allVariants: { color: "#000000" },
    // Heading, Modal Header
    h1: {
      fontWeight: 700,
      fontSize: "1.5rem" // 24px
    },
    // Subheading, Modal subheader
    h2: {
      fontWeight: 700,
      fontSize: "1.25rem" // 20px
    },
    // Blank table header, Toast header
    h3: {
      fontWeight: 700,
      fontSize: "1.125rem" // 18px
    },
    // Input title, Filter heading
    h4: {
      fontWeight: 600,
      fontSize: "1rem" // 16px
    },
    // Filter Category title, Selected filters heading
    h5: {
      fontWeight: 600,
      fontSize: "0.875rem" // 14px
    },
    h6: undefined,
    subtitle1: undefined,
    subtitle2: undefined,
    // Nav heading, Table filter chip, Modal content, Button large, Paragraph, Toggle label
    body1: {
      fontWeight: 400,
      fontSize: "1rem" // 16px
    },
    // Chip/Medium, Modal drag & drop, Dropdown, Blank table content, Table chip, Table content, Button medium
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem" // 14px
    },
    // caption, Button small, Selected filters category, Modal drag & drop ( sm), Chip/small, Toast message
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem" // 12px
    },
    button: undefined,
    overline: undefined,
    onboardingHeader: {
      fontWeight: 700,
      fontSize: "2.25rem"
    },
    // Table heading
    tableHeader: {
      fontWeight: 400,
      fontSize: "0.875rem", // 14px
      letterSpacing: "0.03em",
      textTransform: "uppercase",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap"
    },
    // Label, Modal subtitle
    label: {
      fontWeight: 500,
      fontSize: "1rem" // 16px
    },
    // Placeholder
    placeholder: {
      fontWeight: 400,
      fontSize: "1rem" // 16px
    },
    // Selected filters title
    smallTitle: {
      fontWeight: 600,
      fontSize: "0.75rem" // 12px
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1024,
      xl: 1440
    }
  }
});
