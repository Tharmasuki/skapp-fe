import { Stack, Typography } from "@mui/material";
import { NextRouter, useRouter } from "next/router";

import Button from "~community/common/components/atoms/Button/Button";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";

const Error = () => {
  const translateText = useTranslator("commonError");

  const router: NextRouter = useRouter();

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh"
      }}
      spacing={2}
    >
      <Typography variant="h1">{translateText(["title"])}</Typography>
      <Typography variant="body1">{translateText(["description"])}</Typography>
      <Button
        id="back-to-home-btn"
        dataTestId="back-to-home-btn"
        isFullWidth={false}
        label={translateText(["buttonText"])}
        onClick={() => router.push(ROUTES.DASHBOARD.BASE)}
        ariaLabel={translateText(["buttonText"])}
      />
    </Stack>
  );
};

export default Error;
