function redirectToModelEmiPage(version) {
    const redirectUrl = `/${version.makeMaskingName}-cars/${version.modelMaskingName}/car-loan-emi-calculator/?versionId=${version.versionId}`;
    window.location.href = redirectUrl;
}