import { test, expect, type Page } from "@playwright/test";

test.describe("Gauges", () => {
  const gaugeTestExpectations = [
    {
      url: "artifacts-custom-weewx-html/public_html/index.html",
      current: "20.9°C",
      min: "11.4°C",
      max: "21.5°C",
      title: "Outside Temperature",
    },
    {
      url: "artifacts-custom-weewx-html/public_html/month.html",
      current: "18.2°C",
      min: "8.1°C",
      max: "37.4°C",
      title: "Outside Temperature",
    },
  ];

  const gaugeTestExpectationsFullArc = [
    {
      url: "artifacts-custom-weewx-html/public_html/index.html",
      current: "S / 177°",
      min: "SE",
      max: "S",
      title: "Wind Direction",
    },
    {
      url: "artifacts-custom-weewx-html/public_html/month.html",
      current: "SSW / 198°",
      min: "NNE",
      max: "N",
      title: "Wind Direction",
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");
  });

  for (const testExpectation of gaugeTestExpectations) {
    test(`Basic rendering, url: ${testExpectation.url}`, async ({ page }) => {
      await page.goto(testExpectation.url);

      const outTemp = page.locator('[data-test="outTempGaugeSeries0"] '),
        outTempSVG = outTemp.locator('[data-test="d3-gauge-svg"]');

      await expect(
        outTempSVG.locator(".gauge-text > text >> nth=0")
      ).toHaveText(testExpectation.current);
      await expect(
        outTempSVG.locator(".gauge-text > text >> nth=1")
      ).toHaveText(testExpectation.title);
      await expect(
        outTempSVG.locator(".gauge-text .gauge-legend-min")
      ).toHaveText(testExpectation.min);
      await expect(
        outTempSVG.locator(".gauge-text .gauge-legend-max")
      ).toHaveText(testExpectation.max);

      await expect(outTempSVG.locator(".tick")).toHaveCount(7);
      await expect(outTempSVG.locator(".tick-label >> nth=0")).toHaveText(
        "-20.0°C"
      );
      await expect(outTempSVG.locator(".tick-label >> nth=6")).toHaveText(
        "40.0°C"
      );

      expect(
        await outTemp.locator(".value script").innerText()
      ).toMatchSnapshot();
      await expect(outTemp).toHaveScreenshot();
    });
  }

  for (const testExpectation of gaugeTestExpectationsFullArc) {
    test(`Full arc, url: ${testExpectation.url}`, async ({ page }) => {
      await page.goto(testExpectation.url);

      const windDir = page.locator('[data-test="windDirGaugeSeries3"] '),
        windDirSVG = windDir.locator('[data-test="d3-gauge-svg"]');

      await expect(
        windDirSVG.locator(".gauge-text > text >> nth=0")
      ).toHaveText(testExpectation.current);
      await expect(
        windDirSVG.locator(".gauge-text > text >> nth=1")
      ).toHaveText(testExpectation.title);
      await expect(
        windDirSVG.locator(".gauge-text .gauge-legend-min")
      ).toHaveText(testExpectation.min);
      await expect(
        windDirSVG.locator(".gauge-text .gauge-legend-max")
      ).toHaveText(testExpectation.max);

      await expect(windDirSVG.locator(".tick")).toHaveCount(7);
      await expect(windDirSVG.locator(".tick-label >> nth=0")).toHaveText("N");
      await expect(windDirSVG.locator(".tick-label >> nth=6")).toHaveText("N");

      expect(
        await windDir.locator(".value script").innerText()
      ).toMatchSnapshot();
      await expect(windDir).toHaveScreenshot();
    });
  }

  test("Barometer show_min_max = 0", async ({ page }) => {
    let barometer = page.locator('[data-test="barometerGaugeSeries1"] '),
      barometerSVG = barometer.locator('[data-test="d3-gauge-svg"]');

    await expect(
      barometerSVG.locator(".gauge-text .gauge-legend-min")
    ).toHaveCount(0);
    await expect(
      barometerSVG.locator(".gauge-text .gauge-legend-max")
    ).toHaveCount(0);

    await page.goto("artifacts-custom-weewx-html/public_html/month.html");

    barometer = page.locator('[data-test="barometerGaugeSeries1"] ');
    barometerSVG = barometer.locator('[data-test="d3-gauge-svg"]');

    await expect(
      barometerSVG.locator(".gauge-text .gauge-legend-min")
    ).toHaveText("1001.8 mbar");
    await expect(
      barometerSVG.locator(".gauge-text .gauge-legend-max")
    ).toHaveText("1023.5 mbar");
  });
});
