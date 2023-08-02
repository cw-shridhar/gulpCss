function trackAppliedFilters(filters) {
    const event = "CTInteractive", category = "UsedCarSearch", action = "FilterApplied";
    let label = "";
    Object.keys(filters).forEach(key => {
        if (key) {
            if(FILTER_KEYS.includes(key)) {
                label = `${label}${key}|`;
            }
        }
    });
    if(label) {
        label = label.substring(0, label.length-1);
    }
    analytics.trackAction(
        event,
        category,
        action,
        label
    );
}
