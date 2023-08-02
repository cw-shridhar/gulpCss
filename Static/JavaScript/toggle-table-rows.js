const toggleTableRows = (function() {
	show = function(btnClass, rowClass) {
		const btn = document.querySelector(`.${btnClass}`);
		const rows = document.querySelectorAll(`.${rowClass}`);
		if(btn == null || rows == null) {
			return;
		}

		rows.forEach(row => {
			row.classList.remove("display-none");
		});

		btn.classList.add("display-none");
	}

	return {
		show
	}
})();